
import os
import pandas as pd
import yfinance as yf
from pymongo import MongoClient, ASCENDING
from tqdm import tqdm
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_path)
MONGO_URI = os.getenv('MONGO_URI')

# MongoDB setup
db_name = "Meridian"
collection_name = "stocks"
client = MongoClient(MONGO_URI)
db = client[db_name]
collection = db[collection_name]

# Ensure indexes for idempotency and fast queries
collection.create_index([('ticker', ASCENDING), ('date', ASCENDING)], unique=True)

# NIFTY 50 tickers (start with 10 for testing)
tickers = [
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS", "ICICIBANK.NS",
    "HINDUNILVR.NS", "ITC.NS", "LT.NS", "SBIN.NS", "KOTAKBANK.NS"
]

start_date = "2015-01-01"
end_date = datetime.today().strftime('%Y-%m-%d')

for ticker in tqdm(tickers, desc="Tickers"):
    try:
        df = yf.download(ticker, start=start_date, end=end_date, progress=False)
        if df.empty:
            print(f"❌ No data for {ticker}")
            continue
        df = df.reset_index()
        records = []
        for _, row in df.iterrows():
            record = {
                "ticker": ticker,
                "date": row['Date'].strftime('%Y-%m-%d'),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close']),
                "volume": int(row['Volume']),
                "sentiment_score": None,
                "related_events": [],
                "source_links": []
            }
            records.append(record)
        # Insert only new records (idempotent)
        for rec in tqdm(records, desc=f"{ticker} days", leave=False):
            try:
                collection.update_one(
                    {"ticker": rec["ticker"], "date": rec["date"]},
                    {"$setOnInsert": rec},
                    upsert=True
                )
            except Exception as e:
                print(f"⚠️ Error inserting {rec['ticker']} {rec['date']}: {e}")
        print(f"✅ Inserted/checked {len(records)} records for {ticker}")
    except Exception as e:
        print(f"❌ Error for {ticker}: {e}")
