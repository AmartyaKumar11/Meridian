from ingestion.elastic_client import get_es_client

es = get_es_client()
result = es.search(
    index='stock_news',
    body={
        'size': 0,
        'aggs': {
            'companies': {
                'terms': {
                    'field': 'company',
                    'size': 100
                }
            }
        }
    }
)

companies = result['aggregations']['companies']['buckets']
print(f"\nTotal companies: {len(companies)}\n")
print("Company Name                              | Event Count")
print("-" * 60)
for b in companies:
    print(f"{b['key']:40s} | {b['doc_count']:5d}")
