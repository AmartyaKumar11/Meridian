"""
Check Data Consistency Between Ingestion and Elasticsearch Mapping

Purpose:
    Identify all data type and format inconsistencies between:
    1. What GDELT API returns
    2. What pandas DataFrame contains after processing
    3. What Elasticsearch mapping expects
"""

import json
import pandas as pd
from datetime import datetime
from ingestion.news_ingestor import fetch_gdelt_news
from ingestion.stock_data import get_stock_ohlcv
from ingestion.enrich import enrich_news_with_price
from ingestion.es_loader import prepare_doc
from ingestion.elastic_client import get_default_news_mapping

print("=" * 80)
print("DATA CONSISTENCY CHECK")
print("=" * 80)

# Step 1: Check Elasticsearch Mapping
print("\n1. ELASTICSEARCH MAPPING")
print("-" * 80)
mapping = get_default_news_mapping()
for field, config in mapping["mappings"]["properties"].items():
    field_type = config.get("type", "unknown")
    field_format = config.get("format", "N/A")
    print(f"  {field:25s} | type: {field_type:15s} | format: {field_format}")

# Step 2: Fetch sample data from GDELT
print("\n2. FETCHING SAMPLE DATA FROM GDELT")
print("-" * 80)
news_df = fetch_gdelt_news(
    company="Reliance Industries",
    start_date="20251101",
    end_date="20251107",
    max_records=3
)

if news_df.empty:
    print("❌ No data fetched from GDELT")
    exit(1)

print(f"✓ Fetched {len(news_df)} articles")

# Step 3: Enrich with price data
print("\n3. ENRICHING WITH PRICE DATA")
print("-" * 80)
price_df = get_stock_ohlcv("RELIANCE.NS", "2025-11-01", "2025-11-07")
if not price_df.empty:
    news_df = enrich_news_with_price(news_df, price_df)
    print(f"✓ Enriched with price data ({len(price_df)} price records)")
else:
    print("⚠ No price data available")

# Step 4: Check DataFrame dtypes
print("\n4. DATAFRAME COLUMN TYPES")
print("-" * 80)
for col in news_df.columns:
    dtype = news_df[col].dtype
    sample_value = news_df[col].iloc[0] if len(news_df) > 0 else None
    sample_type = type(sample_value).__name__
    print(f"  {col:25s} | dtype: {str(dtype):20s} | sample type: {sample_type}")

# Step 5: Prepare a document and check types
print("\n5. PREPARED DOCUMENT FOR ELASTICSEARCH")
print("-" * 80)
if len(news_df) > 0:
    doc = prepare_doc(news_df.iloc[0])
    print("Document fields and their Python types:")
    for key, value in doc.items():
        if key == "_id":
            continue
        value_type = type(value).__name__
        value_str = str(value)[:60] if value else "None"
        print(f"  {key:25s} | type: {value_type:15s} | value: {value_str}")

# Step 6: Check for specific inconsistencies
print("\n6. POTENTIAL INCONSISTENCIES")
print("-" * 80)

issues = []

# Check seendate format
if len(news_df) > 0:
    doc = prepare_doc(news_df.iloc[0])
    
    # Check seendate
    seendate = doc.get("seendate")
    if seendate:
        print(f"  seendate value: {seendate}")
        print(f"  seendate type: {type(seendate).__name__}")
        # Check if it matches ES format
        if isinstance(seendate, str):
            if "+00:00" in seendate:
                print("  ✓ seendate has timezone offset (+00:00)")
            elif seendate.endswith("Z"):
                print("  ✓ seendate has Z suffix")
            else:
                issues.append(f"seendate format may not match ES: {seendate}")
    
    # Check fetched_at
    fetched_at = doc.get("fetched_at")
    if fetched_at:
        print(f"  fetched_at value: {fetched_at}")
        print(f"  fetched_at type: {type(fetched_at).__name__}")
    
    # Check numeric fields
    numeric_fields = [
        "sentiment_score", "price_before", "price_after", 
        "price_change_pct", "volume_before", "volume_after",
        "volatility_change", "impact_score"
    ]
    
    print("\n  Numeric Fields:")
    for field in numeric_fields:
        value = doc.get(field)
        if value is not None:
            if not isinstance(value, (int, float)):
                issues.append(f"{field} is not numeric: {type(value).__name__}")
            print(f"    {field:25s}: {value} (type: {type(value).__name__})")
        else:
            print(f"    {field:25s}: None")
    
    # Check array fields
    array_fields = ["keywords", "related_entities"]
    print("\n  Array Fields:")
    for field in array_fields:
        value = doc.get(field)
        if value is not None:
            if not isinstance(value, list):
                issues.append(f"{field} is not a list: {type(value).__name__}")
            print(f"    {field:25s}: {value} (type: {type(value).__name__})")
        else:
            print(f"    {field:25s}: None")

# Step 7: Summary
print("\n7. SUMMARY")
print("=" * 80)

if issues:
    print(f"❌ Found {len(issues)} potential issues:")
    for issue in issues:
        print(f"  - {issue}")
else:
    print("✓ No obvious data type inconsistencies found")

print("\n8. RECOMMENDATIONS")
print("=" * 80)
print("  1. Elasticsearch date mapping should use: strict_date_optional_time||epoch_millis")
print("  2. Python datetime should be converted using .isoformat()")
print("  3. All numeric fields should be float or None (not NaN)")
print("  4. All array fields should be list or None")
print("  5. String fields should be str or None")

print("\n" + "=" * 80)
print("CHECK COMPLETE")
print("=" * 80)
