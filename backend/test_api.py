"""
Test script for FastAPI endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(name, url):
    """Test an API endpoint and print results."""
    print(f"\n{'='*60}")
    print(f"Testing: {name}")
    print(f"URL: {url}")
    print('='*60)
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        print(f"✓ Status: {response.status_code}")
        print(f"Response (first 500 chars):")
        print(json.dumps(data, indent=2, ensure_ascii=False)[:500])
        
        return data
    except Exception as e:
        print(f"✗ Error: {e}")
        return None

# Test all endpoints
print("\n" + "="*60)
print("FASTAPI ENDPOINT TESTING")
print("="*60)

# 1. Health check
test_endpoint("Health Check", f"{BASE_URL}/api/health")

# 2. Get companies
companies_data = test_endpoint("Get All Companies", f"{BASE_URL}/api/companies")

# 3. Get news for Reliance Industries
test_endpoint(
    "Get News - Reliance Industries",
    f"{BASE_URL}/api/news/Reliance%20Industries?limit=5"
)

# 4. Get sentiment timeline
test_endpoint(
    "Get Sentiment Timeline - Reliance Industries",
    f"{BASE_URL}/api/sentiment/Reliance%20Industries?interval=1M"
)

# 5. Get high-impact events
test_endpoint(
    "Get High-Impact Events - Reliance Industries",
    f"{BASE_URL}/api/impact-events/Reliance%20Industries?limit=5"
)

# 6. Get sentiment distribution
test_endpoint(
    "Get Sentiment Distribution",
    f"{BASE_URL}/api/sentiment-distribution"
)

print("\n" + "="*60)
print("✓ ALL TESTS COMPLETE")
print("="*60)
print("\nAPI Documentation: http://localhost:8000/docs")
print("OpenAPI JSON: http://localhost:8000/openapi.json")
