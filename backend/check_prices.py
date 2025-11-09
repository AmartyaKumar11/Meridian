from ingestion.elastic_client import get_es_client

es = get_es_client()

# Check total docs
total = es.count(index='stock_news')
print(f"Total documents: {total['count']}")

# Check docs with price data
result = es.search(
    index='stock_news', 
    body={
        'size': 1, 
        'query': {'exists': {'field': 'price_before'}}
    }
)

price_count = result['hits']['total']['value']
print(f"Documents with price enrichment: {price_count}")

if result['hits']['hits']:
    doc = result['hits']['hits'][0]['_source']
    print(f"\nSample enriched document:")
    print(f"  Company: {doc.get('company')}")
    print(f"  Title: {doc.get('title')[:80]}...")
    print(f"  Date: {doc.get('seendate')}")
    print(f"  Price Before: {doc.get('price_before')}")
    print(f"  Price After: {doc.get('price_after')}")
    print(f"  Price Change %: {doc.get('price_change_pct')}")
    print(f"  Volume Before: {doc.get('volume_before')}")
    print(f"  Volume After: {doc.get('volume_after')}")
    print(f"  Impact Score: {doc.get('impact_score')}")
else:
    print("\nNO PRICE-ENRICHED DOCUMENTS FOUND!")
    print("The pipeline was run WITHOUT --with-prices flag")
