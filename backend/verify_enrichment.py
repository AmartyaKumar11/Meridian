"""
Verify Price Enrichment in Elasticsearch

Purpose:
    Check that indexed documents have price correlation fields
"""

from ingestion.elastic_client import get_es_client

def verify_enrichment():
    es = get_es_client()
    
    # Get total count
    total = es.count(index="stock_news")["count"]
    print(f"\n📊 Total documents: {total}")
    
    # Get a sample document
    result = es.search(
        index="stock_news",
        body={
            "size": 1,
            "query": {"match_all": {}},
            "sort": [{"seendate": "desc"}]
        }
    )
    
    if result["hits"]["hits"]:
        doc = result["hits"]["hits"][0]["_source"]
        print(f"\n📄 Sample document fields:")
        print(f"   Company: {doc.get('company', 'N/A')}")
        print(f"   Title: {doc.get('title', 'N/A')[:80]}...")
        print(f"   Date: {doc.get('seendate', 'N/A')}")
        print(f"   Sentiment: {doc.get('sentiment_label', 'N/A')} ({doc.get('sentiment_score', 'N/A')})")
        
        print(f"\n💰 Price Enrichment Fields:")
        print(f"   price_before: {doc.get('price_before', 'MISSING')}")
        print(f"   price_after: {doc.get('price_after', 'MISSING')}")
        print(f"   price_change_pct: {doc.get('price_change_pct', 'MISSING')}")
        print(f"   volume_before: {doc.get('volume_before', 'MISSING')}")
        print(f"   volume_after: {doc.get('volume_after', 'MISSING')}")
        print(f"   volatility_change: {doc.get('volatility_change', 'MISSING')}")
        print(f"   impact_score: {doc.get('impact_score', 'MISSING')}")
    
    # Count documents WITH price enrichment
    enriched_result = es.search(
        index="stock_news",
        body={
            "size": 0,
            "query": {
                "exists": {"field": "price_before"}
            }
        }
    )
    
    enriched_count = enriched_result["hits"]["total"]["value"]
    print(f"\n✅ Documents with price enrichment: {enriched_count}/{total}")
    
    if enriched_count > 0:
        print(f"   Enrichment rate: {(enriched_count/total)*100:.1f}%")
    else:
        print(f"\n⚠️  WARNING: No documents have price enrichment!")
        print(f"   Make sure you ran the pipeline with --with-prices flag")

if __name__ == "__main__":
    verify_enrichment()
