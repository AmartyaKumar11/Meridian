"""
Fetch historical news for all NIFTY 50 companies (past 2 years)
This will run the pipeline in batches to avoid overwhelming GDELT API
"""

import subprocess
import time
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define all 50 companies
ALL_COMPANIES = [
    "Reliance Industries",
    "Tata Consultancy Services", 
    "Infosys",
    "HDFC Bank",
    "ICICI Bank",
    "Hindustan Unilever",
    "State Bank of India",
    "Bharti Airtel",
    "Bajaj Finance",
    "ITC Limited",
    "Kotak Mahindra Bank",
    "Larsen & Toubro",
    "Axis Bank",
    "Asian Paints",
    "Maruti Suzuki",
    "Sun Pharmaceutical",
    "Titan Company",
    "UltraTech Cement",
    "Wipro",
    "Power Grid Corporation",
    "ONGC",
    "Adani Enterprises",
    "Adani Ports",
    "Apollo Hospitals",
    "Bajaj Auto",
    "Bajaj Finserv",
    "Bharat Petroleum",
    "Britannia Industries",
    "Cipla",
    "Coal India",
    "Divi's Laboratories",
    "Dr Reddy's Laboratories",
    "Eicher Motors",
    "Grasim Industries",
    "HCL Technologies",
    "HDFC Life Insurance",
    "Hero MotoCorp",
    "Hindalco Industries",
    "IndusInd Bank",
    "JSW Steel",
    "LTIMindtree",
    "Mahindra & Mahindra",
    "Nestle India",
    "NTPC",
    "SBI Life Insurance",
    "Tata Consumer Products",
    "Tata Motors",
    "Tata Steel",
    "Tech Mahindra",
    "Trent"
]

def fetch_for_date_range(companies, start_date, end_date):
    """Fetch news for a list of companies for a specific date range"""
    companies_str = ",".join(companies)
    
    logger.info(f"\n{'='*80}")
    logger.info(f"Fetching news for {len(companies)} companies")
    logger.info(f"Date range: {start_date} to {end_date}")
    logger.info(f"{'='*80}\n")
    
    cmd = [
        "D:/DSFM/dashboard/.venv/Scripts/python.exe",
        "run_pipeline.py",
        "--companies", companies_str,
        "--start_date", start_date,
        "--end_date", end_date
    ]
    
    try:
        result = subprocess.run(cmd, cwd="D:/DSFM/dashboard/backend", capture_output=True, text=True)
        logger.info(result.stdout)
        if result.stderr:
            logger.error(result.stderr)
        return result.returncode == 0
    except Exception as e:
        logger.error(f"Error running pipeline: {e}")
        return False

def main():
    """
    Fetch news for all companies in batches over the past 2 years
    We'll fetch in 3-month chunks to avoid API rate limits
    """
    
    # Calculate date ranges (past 2 years in 3-month chunks)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=730)  # 2 years ago
    
    date_ranges = []
    current = start_date
    while current < end_date:
        chunk_end = min(current + timedelta(days=90), end_date)  # 3 month chunks
        date_ranges.append((
            current.strftime("%Y%m%d"),
            chunk_end.strftime("%Y%m%d")
        ))
        current = chunk_end
    
    logger.info(f"\n{'='*80}")
    logger.info(f"HISTORICAL NEWS FETCH")
    logger.info(f"{'='*80}")
    logger.info(f"Companies: {len(ALL_COMPANIES)}")
    logger.info(f"Date ranges: {len(date_ranges)}")
    logger.info(f"Total combinations: {len(ALL_COMPANIES) * len(date_ranges)}")
    logger.info(f"{'='*80}\n")
    
    # Process in batches of 5 companies at a time
    batch_size = 5
    total_batches = (len(ALL_COMPANIES) + batch_size - 1) // batch_size
    
    for i in range(0, len(ALL_COMPANIES), batch_size):
        batch = ALL_COMPANIES[i:i+batch_size]
        batch_num = i // batch_size + 1
        
        logger.info(f"\n{'#'*80}")
        logger.info(f"BATCH {batch_num}/{total_batches}: {', '.join(batch)}")
        logger.info(f"{'#'*80}\n")
        
        for start, end in date_ranges:
            success = fetch_for_date_range(batch, start, end)
            if not success:
                logger.warning(f"Failed to fetch for {start} to {end}")
            
            # Small delay to be nice to GDELT API
            time.sleep(2)
        
        # Longer delay between company batches
        if i + batch_size < len(ALL_COMPANIES):
            logger.info("\n⏸️  Waiting 10 seconds before next company batch...\n")
            time.sleep(10)
    
    logger.info(f"\n{'='*80}")
    logger.info("HISTORICAL FETCH COMPLETE!")
    logger.info(f"{'='*80}\n")

if __name__ == "__main__":
    main()
