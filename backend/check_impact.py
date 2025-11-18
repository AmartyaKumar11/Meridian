from elasticsearch import Elasticsearch

es = Elasticsearch(['http://localhost:9200'])

# Get impact score statistics
result = es.search(
    index='stock_news',
    body={
        'size': 0,
        'aggs': {
            'impact_stats': {
                'stats': {
                    'field': 'impact_score'
                }
            },
            'impact_histogram': {
                'histogram': {
                    'field': 'impact_score',
                    'interval': 0.1
                }
            }
        }
    }
)

stats = result['aggregations']['impact_stats']
print("\nImpact Score Statistics:")
print(f"Min: {stats['min']}")
print(f"Max: {stats['max']}")
print(f"Avg: {stats['avg']}")

print("\nImpact Score Distribution:")
for bucket in result['aggregations']['impact_histogram']['buckets']:
    if bucket['doc_count'] > 0:
        print(f"{bucket['key']:.1f} - {bucket['key']+0.1:.1f}: {bucket['doc_count']} events")

# Get some sample high impact events
high_impact = es.search(
    index='stock_news',
    body={
        'size': 5,
        '_source': ['title', 'impact_score', 'price_change_pct', 'seendate'],
        'query': {
            'range': {
                'impact_score': {'gt': 0}
            }
        },
        'sort': [{'impact_score': {'order': 'desc'}}]
    }
)

print(f"\nTop 5 highest impact events:")
for hit in high_impact['hits']['hits']:
    src = hit['_source']
    print(f"Score: {src.get('impact_score', 0):.3f}, Price change: {src.get('price_change_pct', 'N/A')}, {src['title'][:60]}...")
