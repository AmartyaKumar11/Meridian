"""
Test GDELT API Response Format

Purpose:
    Check what fields GDELT actually returns and their formats
"""

import requests
import json

# Test GDELT API
company = "Reliance Industries"
start_date = "20251101"
end_date = "20251107"
max_records = 5

params = {
    "query": company,
    "mode": "artlist",
    "format": "json",
    "maxrecords": max_records,
    "startdatetime": f"{start_date}000000",
    "enddatetime": f"{end_date}235959",
    "sort": "DateDesc"
}

url = "https://api.gdeltproject.org/api/v2/doc/doc"

print(f"Fetching from: {url}")
print(f"Params: {json.dumps(params, indent=2)}\n")

try:
    response = requests.get(url, params=params, timeout=30)
    response.raise_for_status()
    
    data = response.json()
    
    if "articles" in data and data["articles"]:
        print(f"✓ Got {len(data['articles'])} articles\n")
        
        # Show first article structure
        first_article = data["articles"][0]
        print("First Article Fields:")
        print("=" * 60)
        for key, value in first_article.items():
            value_str = str(value)[:100] if value else "None"
            print(f"  {key:20s}: {value_str}")
        
        print("\n" + "=" * 60)
        print("Raw JSON (first article):")
        print(json.dumps(first_article, indent=2))
    else:
        print("⚠ No articles found")
        print(f"Response: {json.dumps(data, indent=2)}")
        
except Exception as e:
    print(f"✗ Error: {e}")
