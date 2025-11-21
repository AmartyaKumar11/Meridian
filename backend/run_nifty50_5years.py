"""
Nifty 50 - 5 Years Historical News Data Collection
Fetches news for all Nifty 50 stocks from the last 5 years and applies FinBERT sentiment analysis
"""

import sys
from datetime import datetime, timedelta
from run_pipeline import run_pipeline

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

def main():
    print("=" * 80)
    print("NIFTY 50 - 5 YEARS HISTORICAL NEWS DATA COLLECTION")
    print("=" * 80)
    print(f"Total stocks: {len(NIFTY_50_STOCKS)}")
    print(f"Time range: Last 5 years")
    print("=" * 80)
    
    # Calculate date range for last 5 years
    end_date = datetime.now()
    start_date = end_date - timedelta(days=5*365)  # 5 years
    
    start_date_str = start_date.strftime("%Y%m%d")
    end_date_str = end_date.strftime("%Y%m%d")
    
    print(f"\nStart Date: {start_date.strftime('%Y-%m-%d')}")
    print(f"End Date: {end_date.strftime('%Y-%m-%d')}")
    print("\n" + "=" * 80)
    
    successful_companies = []
    failed_companies = []
    
    for idx, (ticker, company_name) in enumerate(NIFTY_50_STOCKS.items(), 1):
        print(f"\n[{idx}/{len(NIFTY_50_STOCKS)}] Processing: {company_name} ({ticker})")
        print("-" * 80)
        
        try:
            # Run pipeline for this company
            run_pipeline(
                companies=[ticker],
                start_date=start_date_str,
                end_date=end_date_str,
                with_prices=True,  # Include price impact calculation
                max_records=5000   # Increase limit for 5 years of data
            )
            
            successful_companies.append(company_name)
            print(f"✅ Successfully processed {company_name}")
            
        except Exception as e:
            failed_companies.append((company_name, str(e)))
            print(f"❌ Failed to process {company_name}: {e}")
            continue
    
    # Final summary
    print("\n" + "=" * 80)
    print("FINAL SUMMARY")
    print("=" * 80)
    print(f"✅ Successful: {len(successful_companies)}/{len(NIFTY_50_STOCKS)}")
    print(f"❌ Failed: {len(failed_companies)}/{len(NIFTY_50_STOCKS)}")
    
    if successful_companies:
        print("\nSuccessfully Processed Companies:")
        for company in successful_companies:
            print(f"  ✅ {company}")
    
    if failed_companies:
        print("\nFailed Companies:")
        for company, error in failed_companies:
            print(f"  ❌ {company}: {error}")
    
    print("\n" + "=" * 80)
    print("PROCESS COMPLETE")
    print("=" * 80)

if __name__ == "__main__":
    main()
