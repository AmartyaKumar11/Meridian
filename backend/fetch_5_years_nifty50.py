"""
Fetch 5 years of news data for all Nifty 50 stocks

This script runs the pipeline in yearly batches to avoid timeouts and rate limits.
It fetches news from November 2020 to November 2025 for all Nifty 50 stocks.

Usage:
    python fetch_5_years_nifty50.py
    
    # Or run with custom year range
    python fetch_5_years_nifty50.py --start-year 2020 --end-year 2025
"""

import argparse
import logging
import subprocess
import sys
from datetime import datetime, timedelta
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def run_pipeline_for_period(start_date: str, end_date: str):
    """
    Run the pipeline for a specific date range.
    
    Args:
        start_date: Start date in YYYYMMDD format
        end_date: End date in YYYYMMDD format
    """
    cmd = [
        sys.executable,  # Use the same Python interpreter
        "run_pipeline.py",
        "--companies", "nifty50",
        "--start_date", start_date,
        "--end_date", end_date,
        "--with-prices",
        "--index", "stock_news",
        "--max-records", "500"  # Increased for better coverage
    ]
    
    logger.info(f"Running pipeline: {start_date} to {end_date}")
    logger.info(f"Command: {' '.join(cmd)}")
    
    try:
        result = subprocess.run(
            cmd,
            cwd=Path(__file__).parent,
            check=True,
            capture_output=False,
            text=True
        )
        logger.info(f"✓ Completed: {start_date} to {end_date}")
        return True
    except subprocess.CalledProcessError as e:
        logger.error(f"✗ Failed: {start_date} to {end_date}")
        logger.error(f"Error: {e}")
        return False


def generate_date_ranges(start_year: int, end_year: int, months_per_batch: int = 3):
    """
    Generate quarterly date ranges to process.
    
    Args:
        start_year: Start year (e.g., 2020)
        end_year: End year (e.g., 2025)
        months_per_batch: Number of months per batch (default: 3 for quarterly)
        
    Returns:
        list: List of (start_date, end_date) tuples in YYYYMMDD format
    """
    date_ranges = []
    current_date = datetime(start_year, 11, 1)  # Start from November
    end_date = datetime(end_year, 11, 21)  # Up to current date
    
    while current_date < end_date:
        # Calculate batch end date (3 months later or end_date, whichever is earlier)
        batch_end = min(
            current_date + timedelta(days=months_per_batch * 30),
            end_date
        )
        
        # Format as YYYYMMDD
        start_str = current_date.strftime("%Y%m%d")
        end_str = batch_end.strftime("%Y%m%d")
        
        date_ranges.append((start_str, end_str))
        
        # Move to next batch
        current_date = batch_end + timedelta(days=1)
    
    return date_ranges


def main():
    parser = argparse.ArgumentParser(
        description="Fetch 5 years of news for Nifty 50 stocks in batches"
    )
    parser.add_argument(
        "--start-year",
        type=int,
        default=2020,
        help="Start year (default: 2020)"
    )
    parser.add_argument(
        "--end-year",
        type=int,
        default=2025,
        help="End year (default: 2025)"
    )
    parser.add_argument(
        "--months-per-batch",
        type=int,
        default=3,
        help="Months per batch (default: 3 for quarterly)"
    )
    
    args = parser.parse_args()
    
    logger.info("=" * 80)
    logger.info("NIFTY 50 - 5 YEAR NEWS DATA COLLECTION")
    logger.info("=" * 80)
    logger.info(f"Period: November {args.start_year} to November {args.end_year}")
    logger.info(f"Batch size: {args.months_per_batch} months")
    logger.info(f"Stocks: All Nifty 50 companies")
    logger.info(f"Features: News + FinBERT Sentiment + Stock Prices + Price Impact")
    logger.info("=" * 80)
    
    # Generate date ranges
    date_ranges = generate_date_ranges(
        args.start_year,
        args.end_year,
        args.months_per_batch
    )
    
    logger.info(f"Total batches to process: {len(date_ranges)}")
    logger.info("")
    
    # Process each batch
    successful = 0
    failed = 0
    
    for i, (start_date, end_date) in enumerate(date_ranges, 1):
        logger.info(f"\n{'=' * 80}")
        logger.info(f"BATCH {i}/{len(date_ranges)}")
        logger.info(f"{'=' * 80}")
        
        if run_pipeline_for_period(start_date, end_date):
            successful += 1
        else:
            failed += 1
            # Continue even if one batch fails
            logger.warning(f"Batch {i} failed, continuing with next batch...")
    
    # Final summary
    logger.info("\n" + "=" * 80)
    logger.info("FINAL SUMMARY")
    logger.info("=" * 80)
    logger.info(f"Total batches: {len(date_ranges)}")
    logger.info(f"Successful: {successful}")
    logger.info(f"Failed: {failed}")
    logger.info("=" * 80)
    
    if failed == 0:
        logger.info("✓ All batches completed successfully!")
    else:
        logger.warning(f"⚠ {failed} batch(es) failed. Check logs for details.")


if __name__ == "__main__":
    main()
