"""
Quick script to verify indexed data in Elasticsearch
"""
from ingestion.elastic_client import get_es_client
import json

es = get_es_client()

# Get total count
count_result = es.count(index='stock_news')
total = count_result['count']
print(f"✓ Total documents indexed: {total}")

# Check specific company
print("\n=== Testing Reliance Industries ===")
reliance_result = es.search(
    index='stock_news',
    body={
        "query": {"match": {"company": "Reliance Industries"}},
        "size": 0
    }
)
print(f"Reliance Industries articles: {reliance_result['hits']['total']['value']}")

# Get aggregation by company
agg_query = {
    "size": 0,
    "aggs": {
        "companies": {
            "terms": {
                "field": "company",
                "size": 50
            }
        },
        "sentiments": {
            "terms": {
                "field": "sentiment_label",
                "size": 10
            }
        },
        "languages": {
            "terms": {
                "field": "language",
                "size": 10
            }
        }
    }
}

agg_result = es.search(index='stock_news', body=agg_query)

print("\n=== Top 15 Companies (by article count) ===")
for bucket in agg_result['aggregations']['companies']['buckets'][:15]:
    print(f"{bucket['key']}: {bucket['doc_count']} articles")

print("\n=== Sentiment Distribution ===")
for bucket in agg_result['aggregations']['sentiments']['buckets']:
    print(f"{bucket['key']}: {bucket['doc_count']} articles ({bucket['doc_count']/total*100:.1f}%)")

print("\n=== Language Distribution ===")
for bucket in agg_result['aggregations']['languages']['buckets']:
    print(f"{bucket['key']}: {bucket['doc_count']} articles")
print("\n=== Language Distribution ===")
for bucket in agg_result['aggregations']['languages']['buckets']:
    print(f"{bucket['key']}: {bucket['doc_count']} articles")

# Get sample Indian stock news
print("\n=== Sample INDIAN Stock News ===")
indian_query = {
    "size": 3,
    "query": {
        "bool": {
            "must": [
                {"match": {"sourceCountry": "India"}}
            ]
        }
    },
    "sort": [{"fetched_at": {"order": "desc"}}]
}

indian_result = es.search(index='stock_news', body=indian_query)
print(f"Total Indian news: {indian_result['hits']['total']['value']}")

for i, hit in enumerate(indian_result['hits']['hits'], 1):
    doc = hit['_source']
    print(f"\n--- Indian Article {i} ---")
    print(f"Company: {doc.get('company')}")
    print(f"Title: {doc.get('title')[:100]}...")
    print(f"Sentiment: {doc.get('sentiment_label')} (score: {doc.get('sentiment_score'):.3f})")
    print(f"Domain: {doc.get('domain')}")
    print(f"URL: {doc.get('url')[:80]}...")

print("\n✓ Data verification complete!")
