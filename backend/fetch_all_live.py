"""
Fetch 5 years of historical news for all 50 stocks - WITH LIVE OUTPUT
"""
import subprocess
import sys
from datetime import datetime, timedelta

# List of all 50 companies
companies = [
    "Reliance Industries", "Tata Consultancy Services", "Infosys", "HDFC Bank",
    "ICICI Bank", "Hindustan Unilever", "State Bank of India", "Bharti Airtel",
    "Bajaj Finance", "ITC Limited", "Kotak Mahindra Bank", "Larsen & Toubro",
    "Axis Bank", "Asian Paints", "Maruti Suzuki", "Sun Pharmaceutical",
    "Titan Company", "UltraTech Cement", "Wipro", "Power Grid Corporation",
    "ONGC", "Adani Enterprises", "Adani Ports", "Apollo Hospitals",
    "Bajaj Auto", "Bajaj Finserv", "Bharat Petroleum", "Coal India",
    "Cipla", "Dr Reddy's Laboratories", "Eicher Motors", "Grasim Industries",
    "HCL Technologies", "Hero MotoCorp", "Hindalco Industries", "HDFC Life",
    "IndusInd Bank", "JSW Steel", "Mahindra & Mahindra", "Nestle India",
    "NTPC", "Tata Steel", "Tech Mahindra", "Tata Motors", "Tata Consumer Products",
    "Shree Cement", "SBI Life Insurance", "Britannia Industries", "Divis Laboratories",
    "HDFC Asset Management"
]

# Calculate date range (5 years from today)
end_date = datetime.now()
start_date = end_date - timedelta(days=5*365)  # 5 years

start_date_str = start_date.strftime("%Y%m%d")
end_date_str = end_date.strftime("%Y%m%d")

print(f"Fetching news for {len(companies)} companies")
print(f"Date range: {start_date_str} to {end_date_str}")
print(f"This will take several hours...\n")

# Run pipeline for each company
success_count = 0
fail_count = 0

for i, company in enumerate(companies, 1):
    print(f"\n{'='*70}")
    print(f"[{i}/{len(companies)}] Processing: {company}")
    print('='*70)
    
    try:
        # Run the pipeline for this company WITH LIVE OUTPUT
        cmd = [
            sys.executable,
            "run_pipeline.py",
            "--companies", company,
            "--start_date", start_date_str,
            "--end_date", end_date_str,
            "--batch-size", "500"
        ]
        
        # Run with live output (no capture)
        result = subprocess.run(
            cmd,
            cwd=r"D:\DSFM\dashboard\backend"
        )
        
        if result.returncode == 0:
            print(f"\n✅ Successfully fetched news for {company}")
            success_count += 1
        else:
            print(f"\n❌ Error fetching news for {company}")
            fail_count += 1
            
    except Exception as e:
        print(f"\n❌ Exception for {company}: {e}")
        fail_count += 1
    
    print(f"\nProgress: {success_count} success, {fail_count} failed")

print("\n" + "=" * 70)
print(f"FETCH COMPLETE!")
print(f"Success: {success_count}/{len(companies)}")
print(f"Failed: {fail_count}/{len(companies)}")
print("=" * 70)
