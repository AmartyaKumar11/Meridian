"""
Nifty 50 - 5 Years Historical News Data Collection (Chunked)
Fetches news in 3-month chunks to avoid GDELT API timeouts
"""

import sys
from datetime import datetime, timedelta
from run_pipeline import run_pipeline
from dateutil.relativedelta import relativedelta

# Nifty 50 stocks mapping
NIFTY_50_STOCKS = {
    "RELIANCE.NS": "Reliance Industries",
    "TCS.NS": "Tata Consultancy Services",
    "HDFCBANK.NS": "HDFC Bank",
    "INFY.NS": "Infosys",
    "ICICIBANK.NS": "ICICI Bank",
    "HINDUNILVR.NS": "Hindustan Unilever",
    "SBIN.NS": "State Bank of India",
    "BHARTIARTL.NS": "Bharti Airtel",
    "KOTAKBANK.NS": "Kotak Mahindra Bank",
    "ITC.NS": "ITC",
    "LT.NS": "Larsen & Toubro",
    "AXISBANK.NS": "Axis Bank",
    "BAJFINANCE.NS": "Bajaj Finance",
    "ASIANPAINT.NS": "Asian Paints",
    "MARUTI.NS": "Maruti Suzuki",
    "HCLTECH.NS": "HCL Technologies",
    "SUNPHARMA.NS": "Sun Pharmaceutical",
    "TITAN.NS": "Titan Company",
    "ULTRACEMCO.NS": "UltraTech Cement",
    "WIPRO.NS": "Wipro",
    "NESTLEIND.NS": "Nestle India",
    "POWERGRID.NS": "Power Grid Corporation",
    "ONGC.NS": "Oil and Natural Gas Corporation",
    "NTPC.NS": "NTPC",
    "TATAMOTORS.NS": "Tata Motors",
    "M&M.NS": "Mahindra & Mahindra",
    "TECHM.NS": "Tech Mahindra",
    "ADANIPORTS.NS": "Adani Ports",
    "ADANIENT.NS": "Adani Enterprises",
    "BAJAJFINSV.NS": "Bajaj Finserv",
    "COALINDIA.NS": "Coal India",
    "TATASTEEL.NS": "Tata Steel",
    "HINDALCO.NS": "Hindalco Industries",
    "DIVISLAB.NS": "Divi's Laboratories",
    "DRREDDY.NS": "Dr. Reddy's Laboratories",
    "CIPLA.NS": "Cipla",
    "APOLLOHOSP.NS": "Apollo Hospitals",
    "BRITANNIA.NS": "Britannia Industries",
    "EICHERMOT.NS": "Eicher Motors",
    "HEROMOTOCO.NS": "Hero MotoCorp",
    "GRASIM.NS": "Grasim Industries",
    "JSWSTEEL.NS": "JSW Steel",
    "SHRIRAMFIN.NS": "Shriram Finance",
    "INDUSINDBK.NS": "IndusInd Bank",
    "TATACONSUM.NS": "Tata Consumer Products",
    "SBILIFE.NS": "SBI Life Insurance",
    "HDFCLIFE.NS": "HDFC Life Insurance",
    "BAJAJ-AUTO.NS": "Bajaj Auto",
    "BPCL.NS": "Bharat Petroleum"
}

def generate_date_chunks(start_date, end_date, months=3):
    """Generate date chunks of N months"""
    chunks = []
    current = start_date
    
    while current < end_date:
        chunk_end = min(current + relativedelta(months=months), end_date)
        chunks.append((current, chunk_end))
        current = chunk_end + timedelta(days=1)
    
    return chunks

def main():
    print("=" * 80)
    print("NIFTY 50 - 5 YEARS HISTORICAL NEWS DATA COLLECTION (CHUNKED)")
    print("=" * 80)
    print(f"Total stocks: {len(NIFTY_50_STOCKS)}")
    print(f"Time range: Last 5 years in 3-month chunks")
    print("=" * 80)
    
    # Calculate date range for last 5 years
    end_date = datetime.now()
    start_date = end_date - timedelta(days=5*365)
    
    # Generate 3-month chunks
    date_chunks = generate_date_chunks(start_date, end_date, months=3)
    
    print(f"\nStart Date: {start_date.strftime('%Y-%m-%d')}")
    print(f"End Date: {end_date.strftime('%Y-%m-%d')}")
    print(f"Total chunks: {len(date_chunks)} (3 months each)")
    print("\n" + "=" * 80)
    
    successful_companies = []
    failed_companies = []
    
    for idx, (ticker, company_name) in enumerate(NIFTY_50_STOCKS.items(), 1):
        print(f"\n[{idx}/{len(NIFTY_50_STOCKS)}] Processing: {company_name} ({ticker})")
        print("-" * 80)
        
        company_success = True
        total_articles = 0
        
        for chunk_idx, (chunk_start, chunk_end) in enumerate(date_chunks, 1):
            start_str = chunk_start.strftime("%Y%m%d")
            end_str = chunk_end.strftime("%Y%m%d")
            
            print(f"  Chunk {chunk_idx}/{len(date_chunks)}: {chunk_start.strftime('%Y-%m-%d')} to {chunk_end.strftime('%Y-%m-%d')}")
            
            try:
                # Run pipeline for this chunk
                run_pipeline(
                    companies=[ticker],
                    start_date=start_str,
                    end_date=end_str,
                    with_prices=True,
                    max_records=500  # Limit per chunk
                )
                
            except Exception as e:
                print(f"    ⚠️ Chunk {chunk_idx} failed: {e}")
                company_success = False
                continue
        
        if company_success:
            successful_companies.append(company_name)
            print(f"✅ Successfully processed {company_name}")
        else:
            failed_companies.append((company_name, "Some chunks failed"))
            print(f"⚠️ Partially processed {company_name}")
    
    # Final summary
    print("\n" + "=" * 80)
    print("FINAL SUMMARY")
    print("=" * 80)
    print(f"✅ Successful: {len(successful_companies)}/{len(NIFTY_50_STOCKS)}")
    print(f"⚠️ Partial/Failed: {len(failed_companies)}/{len(NIFTY_50_STOCKS)}")
    
    if successful_companies:
        print("\nSuccessfully Processed Companies:")
        for company in successful_companies:
            print(f"  ✅ {company}")
    
    if failed_companies:
        print("\nPartially Processed Companies:")
        for company, error in failed_companies:
            print(f"  ⚠️ {company}: {error}")
    
    print("\n" + "=" * 80)
    print("PROCESS COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    main()
