"""
Calculate impact scores for all existing news events in Elasticsearch
"""
from elasticsearch import Elasticsearch
from elasticsearch.helpers import scan, bulk
import yfinance as yf
from datetime import datetime, timedelta
import time

es = Elasticsearch(['http://localhost:9200'])

# Ticker mapping
name_to_ticker = {
    "Reliance Industries": "RELIANCE.NS",
    "Tata Consultancy Services": "TCS.NS",
    "Infosys": "INFY.NS",
    "HDFC Bank": "HDFCBANK.NS",
    "ICICI Bank": "ICICIBANK.NS",
    "Hindustan Unilever": "HINDUNILVR.NS",
    "State Bank of India": "SBIN.NS",
    "Bharti Airtel": "BHARTIARTL.NS",
    "Bajaj Finance": "BAJFINANCE.NS",
    "ITC Limited": "ITC.NS",
    "Kotak Mahindra Bank": "KOTAKBANK.NS",
    "Larsen & Toubro": "LT.NS",
    "Axis Bank": "AXISBANK.NS",
    "Asian Paints": "ASIANPAINT.NS",
    "Maruti Suzuki": "MARUTI.NS",
    "Sun Pharmaceutical": "SUNPHARMA.NS",
    "Titan Company": "TITAN.NS",
    "UltraTech Cement": "ULTRACEMCO.NS",
    "Wipro": "WIPRO.NS",
    "Power Grid Corporation": "POWERGRID.NS",
    "ONGC": "ONGC.NS",
    "Adani Enterprises": "ADANIENT.NS",
    "Adani Ports": "ADANIPORTS.NS",
    "Apollo Hospitals": "APOLLOHOSP.NS",
    "Bajaj Auto": "BAJAJ-AUTO.NS",
    "Bajaj Finserv": "BAJAJFINSV.NS",
    "Bharat Petroleum": "BPCL.NS",
    "Britannia Industries": "BRITANNIA.NS",
    "Cipla": "CIPLA.NS",
    "Coal India": "COALINDIA.NS",
    "Divis Laboratories": "DIVISLAB.NS",
    "Dr Reddy's Laboratories": "DRREDDY.NS",
    "Eicher Motors": "EICHERMOT.NS",
    "Grasim Industries": "GRASIM.NS",
    "HCL Technologies": "HCLTECH.NS",
    "HDFC Life": "HDFCLIFE.NS",
    "Hero MotoCorp": "HEROMOTOCO.NS",
    "Hindalco Industries": "HINDALCO.NS",
    "IndusInd Bank": "INDUSINDBK.NS",
    "JSW Steel": "JSWSTEEL.NS",
    "Mahindra & Mahindra": "M&M.NS",
    "Nestle India": "NESTLEIND.NS",
    "NTPC": "NTPC.NS",
    "SBI Life Insurance": "SBILIFE.NS",
    "Tata Consumer Products": "TATACONSUM.NS",
    "Tata Motors": "TATAMOTORS.NS",
    "Tata Steel": "TATASTEEL.NS",
    "Tech Mahindra": "TECHM.NS",
    "Shree Cement": "SHREECEM.NS",
    "HDFC Asset Management": "HDFCAMC.NS"
}

def get_price_change(ticker, event_date):
    """Get price change around event date"""
    try:
        # Get 5 days before and after
        start = event_date - timedelta(days=7)
        end = event_date + timedelta(days=7)
        
        stock = yf.Ticker(ticker)
        hist = stock.history(start=start, end=end)
        
        if len(hist) < 2:
            return None
            
        # Find closest dates
        before_price = None
        after_price = None
        
        for i, (date, row) in enumerate(hist.iterrows()):
            if date.date() <= event_date.date():
                before_price = row['Close']
            elif date.date() > event_date.date() and after_price is None:
                after_price = row['Close']
                break
        
        if before_price and after_price:
            price_change_pct = ((after_price - before_price) / before_price) * 100
            return price_change_pct
    except Exception as e:
        print(f"   Error fetching price for {ticker}: {e}")
    return None

print("Calculating impact scores for all events...")
print("=" * 60)

# Get all documents
total_docs = es.count(index='stock_news')['count']
print(f"Total documents: {total_docs}")

updated_count = 0
error_count = 0
batch_actions = []

# Scan all documents
for i, doc in enumerate(scan(es, index='stock_news', query={"query": {"match_all": {}}}), 1):
    if i % 100 == 0:
        print(f"Processing: {i}/{total_docs}")
    
    source = doc['_source']
    company = source.get('company')
    ticker = name_to_ticker.get(company)
    
    if not ticker:
        continue
    
    # Skip if already has impact score > 0
    if source.get('impact_score', 0) > 0:
        continue
    
    try:
        # Parse event date
        event_date = datetime.fromisoformat(source['seendate'].replace('Z', '+00:00'))
        
        # Get price change
        price_change_pct = get_price_change(ticker, event_date)
        
        if price_change_pct is not None:
            # Calculate impact score
            sentiment_score = abs(source.get('sentiment_score', 0.5))
            impact_score = sentiment_score * abs(price_change_pct) / 10.0
            
            # Add to batch update
            batch_actions.append({
                '_op_type': 'update',
                '_index': 'stock_news',
                '_id': doc['_id'],
                'doc': {
                    'price_change_pct': price_change_pct,
                    'impact_score': impact_score
                }
            })
            
            updated_count += 1
            
            # Bulk update every 100 documents
            if len(batch_actions) >= 100:
                bulk(es, batch_actions)
                print(f"   Updated {updated_count} documents")
                batch_actions = []
                time.sleep(1)  # Rate limiting
                
    except Exception as e:
        error_count += 1
        if error_count % 10 == 0:
            print(f"   Errors: {error_count}")

# Final bulk update
if batch_actions:
    bulk(es, batch_actions)

print("\n" + "=" * 60)
print(f"Impact calculation complete!")
print(f"Updated: {updated_count} documents")
print(f"Errors: {error_count}")
print("=" * 60)
