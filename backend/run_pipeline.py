"""
News Ingestion Pipeline Orchestrator

PURPOSE:
    End-to-end pipeline to fetch news from GDELT, enrich with FinBERT sentiment,
    optionally fetch stock prices, compute event metrics, and bulk index into Elasticsearch.

USAGE:
    python run_pipeline.py --companies RELIANCE.NS,TCS.NS --start_date 20251001 --end_date 20251007
    python run_pipeline.py --companies nifty50 --start_date 20251101 --end_date 20251107 --with-prices

EXPECTED BEHAVIOR:
    1. Loads company tickers from company_tickers.json (or uses CLI args)
    2. For each company:
       - Fetches news from GDELT DOC API
       - Enriches with FinBERT sentiment
       - Optionally fetches stock prices and computes event metrics
       - Indexes enriched documents into Elasticsearch
    3. Prints summary: companies processed, documents indexed, time taken

TESTING:
    # Test with single company
    python run_pipeline.py --companies "Reliance Industries" --start_date 20251101 --end_date 20251105

    # Test with NIFTY50 (loads from company_tickers.json)
    python run_pipeline.py --companies nifty50 --start_date 20251101 --end_date 20251107

REQUIREMENTS:
    - Elasticsearch running at localhost:9200 (or set ES_HOST in .env)
    - company_tickers.json in project root
    - .env file with configuration (optional)
"""

import argparse
import json
import logging
import os
import sys
import time
from datetime import datetime
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from ingestion.elastic_client import get_es_client
from ingestion.news_ingestor import fetch_gdelt_news
from ingestion.stock_data import get_stock_ohlcv
from ingestion.enrich import enrich_news_with_price
from ingestion.es_loader import index_dataframe

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def load_company_tickers(file_path: str = "company_tickers.json") -> list:
    """
    Load company tickers from JSON file and convert to company names.
    
    Args:
        file_path: Path to JSON file with company tickers
        
    Returns:
        list: List of company names (converted from tickers)
    """
    # Mapping of tickers to company names for GDELT search
    ticker_to_name = {
        "RELIANCE.NS": "Reliance Industries",
        "TCS.NS": "Tata Consultancy Services",
        "INFY.NS": "Infosys",
        "HDFCBANK.NS": "HDFC Bank",
        "ICICIBANK.NS": "ICICI Bank",
        "HINDUNILVR.NS": "Hindustan Unilever",
        "SBIN.NS": "State Bank of India",
        "BHARTIARTL.NS": "Bharti Airtel",
        "BAJFINANCE.NS": "Bajaj Finance",
        "ITC.NS": "ITC Limited",
        "KOTAKBANK.NS": "Kotak Mahindra Bank",
        "LT.NS": "Larsen & Toubro",
        "AXISBANK.NS": "Axis Bank",
        "ASIANPAINT.NS": "Asian Paints",
        "MARUTI.NS": "Maruti Suzuki",
        "SUNPHARMA.NS": "Sun Pharmaceutical",
        "TITAN.NS": "Titan Company",
        "ULTRACEMCO.NS": "UltraTech Cement",
        "WIPRO.NS": "Wipro",
        "POWERGRID.NS": "Power Grid Corporation",
        "ONGC.NS": "ONGC",
        "ADANIENT.NS": "Adani Enterprises",
        "ADANIPORTS.NS": "Adani Ports",
        "APOLLOHOSP.NS": "Apollo Hospitals",
        "BAJAJ-AUTO.NS": "Bajaj Auto",
        "BAJAJFINSV.NS": "Bajaj Finserv",
        "BPCL.NS": "Bharat Petroleum",
        "BRITANNIA.NS": "Britannia Industries",
        "CIPLA.NS": "Cipla",
        "COALINDIA.NS": "Coal India",
        "DIVISLAB.NS": "Divi's Laboratories",
        "DRREDDY.NS": "Dr Reddy's Laboratories",
        "EICHERMOT.NS": "Eicher Motors",
        "GRASIM.NS": "Grasim Industries",
        "HCLTECH.NS": "HCL Technologies",
        "HDFCLIFE.NS": "HDFC Life Insurance",
        "HEROMOTOCO.NS": "Hero MotoCorp",
        "HINDALCO.NS": "Hindalco Industries",
        "INDUSINDBK.NS": "IndusInd Bank",
        "JSWSTEEL.NS": "JSW Steel",
        "LTIM.NS": "LTIMindtree",
        "M&M.NS": "Mahindra & Mahindra",
        "NESTLEIND.NS": "Nestle India",
        "NTPC.NS": "NTPC",
        "SBILIFE.NS": "SBI Life Insurance",
        "TATACONSUM.NS": "Tata Consumer Products",
        "TATAMOTORS.NS": "Tata Motors",
        "TATASTEEL.NS": "Tata Steel",
        "TECHM.NS": "Tech Mahindra",
        "TRENT.NS": "Trent"
    }
    
    try:
        # Try multiple possible locations
        possible_paths = [
            file_path,
            Path(__file__).parent / file_path,
            Path(__file__).parent.parent / file_path
        ]
        
        for path in possible_paths:
            if Path(path).exists():
                with open(path, 'r') as f:
                    tickers = json.load(f)
                # Convert tickers to company names
                companies = [ticker_to_name.get(ticker, ticker.replace(".NS", "")) for ticker in tickers]
                logger.info(f"Loaded {len(companies)} company names from {path}")
                return companies
        
        logger.warning(f"Company tickers file not found at {file_path}")
        return []
        
    except Exception as e:
        logger.error(f"Error loading company tickers: {e}")
        return []


def parse_companies(companies_arg: str) -> list:
    """
    Parse companies argument (comma-separated or 'nifty50').
    
    Args:
        companies_arg: Company names/tickers or 'nifty50'
        
    Returns:
        list: List of company names/tickers
    """
    if companies_arg.lower() == "nifty50":
        return load_company_tickers()
    else:
        return [c.strip() for c in companies_arg.split(",")]


def get_ticker_for_company(company_name: str) -> str:
    """
    Convert company name to ticker symbol for yfinance.
    
    Args:
        company_name: Company name (e.g., "Reliance Industries")
        
    Returns:
        str: Ticker symbol (e.g., "RELIANCE.NS")
    """
    # Mapping of company names to tickers
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
        "Divi's Laboratories": "DIVISLAB.NS",
        "Dr Reddy's Laboratories": "DRREDDY.NS",
        "Eicher Motors": "EICHERMOT.NS",
        "Grasim Industries": "GRASIM.NS",
        "HCL Technologies": "HCLTECH.NS",
        "HDFC Life Insurance": "HDFCLIFE.NS",
        "Hero MotoCorp": "HEROMOTOCO.NS",
        "Hindalco Industries": "HINDALCO.NS",
        "IndusInd Bank": "INDUSINDBK.NS",
        "JSW Steel": "JSWSTEEL.NS",
        "LTIMindtree": "LTIM.NS",
        "Mahindra & Mahindra": "M&M.NS",
        "Nestle India": "NESTLEIND.NS",
        "NTPC": "NTPC.NS",
        "SBI Life Insurance": "SBILIFE.NS",
        "Tata Consumer Products": "TATACONSUM.NS",
        "Tata Motors": "TATAMOTORS.NS",
        "Tata Steel": "TATASTEEL.NS",
        "Tech Mahindra": "TECHM.NS",
        "Trent": "TRENT.NS"
    }
    
    return name_to_ticker.get(company_name, company_name)


def run_pipeline(
    companies: list,
    start_date: str,
    end_date: str,
    index_name: str = "stock_news",
    with_prices: bool = False,
    max_records: int = 250
):
    """
    Run the complete news ingestion pipeline.
    
    Args:
        companies: List of company names or tickers
        start_date: Start date (YYYYMMDD)
        end_date: End date (YYYYMMDD)
        index_name: Elasticsearch index name (default: stock_news)
        with_prices: Whether to fetch and enrich with price data (default: False)
        max_records: Max records per company (default: 250)
    """
    start_time = time.time()
    
    logger.info("=" * 80)
    logger.info("STARTING NEWS INGESTION PIPELINE")
    logger.info("=" * 80)
    logger.info(f"Companies: {len(companies)}")
    logger.info(f"Date range: {start_date} to {end_date}")
    logger.info(f"Index: {index_name}")
    logger.info(f"With prices: {with_prices}")
    logger.info("=" * 80)
    
    # Initialize Elasticsearch client
    try:
        es = get_es_client()
    except Exception as e:
        logger.error(f"Failed to connect to Elasticsearch: {e}")
        return
    
    total_docs_indexed = 0
    total_docs_failed = 0
    companies_processed = 0
    
    for company in companies:
        try:
            logger.info(f"\n{'=' * 60}")
            logger.info(f"Processing: {company}")
            logger.info(f"{'=' * 60}")
            
            # Fetch news from GDELT
            news_df = fetch_gdelt_news(
                company=company,
                start_date=start_date,
                end_date=end_date,
                max_records=max_records
            )
            
            if news_df.empty:
                logger.warning(f"No news found for {company}. Skipping.")
                continue
            
            # Optionally enrich with price data
            if with_prices:
                logger.info(f"Fetching stock prices for {company}...")
                
                # Convert company name to ticker symbol
                ticker = get_ticker_for_company(company)
                logger.info(f"Using ticker: {ticker}")
                
                # Convert date format for yfinance (YYYYMMDD -> YYYY-MM-DD)
                start_yf = f"{start_date[:4]}-{start_date[4:6]}-{start_date[6:8]}"
                end_yf = f"{end_date[:4]}-{end_date[4:6]}-{end_date[6:8]}"
                
                price_df = get_stock_ohlcv(ticker, start_yf, end_yf)
                
                if not price_df.empty:
                    logger.info("Enriching news with price metrics...")
                    news_df = enrich_news_with_price(news_df, price_df)
                else:
                    logger.warning(f"No price data found for {ticker}")
            
            # Index into Elasticsearch
            result = index_dataframe(
                es=es,
                index_name=index_name,
                df=news_df,
                batch_size=500,
                create_index=True
            )
            
            total_docs_indexed += result["success"]
            total_docs_failed += result["failed"]
            companies_processed += 1
            
            logger.info(f"✓ {company}: {result['success']} docs indexed")
            
            # Rate limiting between companies
            time.sleep(1)
            
        except Exception as e:
            logger.error(f"Error processing {company}: {e}")
            continue
    
    # Print summary
    elapsed_time = time.time() - start_time
    
    logger.info("\n" + "=" * 80)
    logger.info("PIPELINE EXECUTION SUMMARY")
    logger.info("=" * 80)
    logger.info(f"Companies processed: {companies_processed}/{len(companies)}")
    logger.info(f"Documents indexed: {total_docs_indexed}")
    logger.info(f"Documents failed: {total_docs_failed}")
    logger.info(f"Time taken: {elapsed_time:.2f} seconds")
    logger.info("=" * 80)


def main():
    """Main entry point for the pipeline."""
    # Load environment variables
    load_dotenv()
    
    # Parse command-line arguments
    parser = argparse.ArgumentParser(
        description="GDELT News Ingestion Pipeline with FinBERT Sentiment",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Single company
  python run_pipeline.py --companies "Reliance Industries" --start_date 20251001 --end_date 20251007

  # Multiple companies
  python run_pipeline.py --companies RELIANCE.NS,TCS.NS,INFY.NS --start_date 20251001 --end_date 20251007

  # All NIFTY50 companies
  python run_pipeline.py --companies nifty50 --start_date 20251001 --end_date 20251007 --with-prices

  # Custom index name
  python run_pipeline.py --companies nifty50 --start_date 20251101 --end_date 20251107 --index stock_event_news
        """
    )
    
    parser.add_argument(
        "--companies",
        type=str,
        required=True,
        help="Comma-separated company names/tickers or 'nifty50' to load from company_tickers.json"
    )
    
    parser.add_argument(
        "--start_date",
        type=str,
        required=True,
        help="Start date in YYYYMMDD format (e.g., 20251001)"
    )
    
    parser.add_argument(
        "--end_date",
        type=str,
        required=True,
        help="End date in YYYYMMDD format (e.g., 20251007)"
    )
    
    parser.add_argument(
        "--index",
        type=str,
        default=os.getenv("ES_INDEX_NAME", "stock_news"),
        help="Elasticsearch index name (default: stock_news)"
    )
    
    parser.add_argument(
        "--with-prices",
        action="store_true",
        help="Fetch stock prices and compute event metrics (default: False)"
    )
    
    parser.add_argument(
        "--max-records",
        type=int,
        default=int(os.getenv("GDELT_MAXRECORDS", "250")),
        help="Max records per company (default: 250)"
    )
    
    args = parser.parse_args()
    
    # Parse companies
    companies = parse_companies(args.companies)
    
    if not companies:
        logger.error("No companies specified. Exiting.")
        sys.exit(1)
    
    # Run pipeline
    run_pipeline(
        companies=companies,
        start_date=args.start_date,
        end_date=args.end_date,
        index_name=args.index,
        with_prices=args.with_prices,
        max_records=args.max_records
    )


if __name__ == "__main__":
    main()
