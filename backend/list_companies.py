from ingestion.elastic_client import get_es_client

es = get_es_client()
result = es.search(
    index='stock_news',
    body={
        'size': 0,
        'aggs': {
            'companies': {
                'terms': {
                    'field': 'company.keyword',
                    'size': 50
                }
            }
        }
    }
)

companies = result['aggregations']['companies']['buckets']
print("\nCompanies in Elasticsearch:")
print("-" * 60)
for bucket in companies:
    print(f"{bucket['key']}: {bucket['doc_count']} events")
