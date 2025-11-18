from ingestion.elastic_client import get_es_client

es = get_es_client()

# Get total count
count_result = es.count(index='stock_news')
print(f"\n✅ Total documents in Elasticsearch: {count_result['count']}")

# Get company aggregation
result = es.search(
    index='stock_news',
    body={
        'size': 0,
        'aggs': {
            'companies': {
                'terms': {
                    'field': 'company.keyword',
                    'size': 100
                }
            }
        }
    }
)

companies = result['aggregations']['companies']['buckets']
print(f"\n✅ Total unique companies: {len(companies)}")
print("\n" + "="*80)
print("Companies with news articles:")
print("="*80)
for i, bucket in enumerate(companies, 1):
    print(f"{i:2d}. {bucket['key']:40s} - {bucket['doc_count']:5d} articles")

# Sample document
sample = es.search(index='stock_news', body={'size': 1})
if sample['hits']['hits']:
    doc = sample['hits']['hits'][0]['_source']
    print("\n" + "="*80)
    print("Sample document structure:")
    print("="*80)
    for key, value in doc.items():
        if isinstance(value, str) and len(value) > 100:
            print(f"  {key}: {value[:100]}...")
        else:
            print(f"  {key}: {value}")
