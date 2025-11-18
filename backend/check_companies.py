from elasticsearch import Elasticsearch

es = Elasticsearch(['http://localhost:9200'])

# Get all unique company names
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
print('\nCompanies in Elasticsearch:')
print('-' * 60)
for c in companies:
    print(f"{c['key']}: {c['doc_count']} articles")

# Also check a sample document
sample = es.search(index='stock_news', body={'size': 1})
if sample['hits']['hits']:
    print('\nSample document:')
    print(sample['hits']['hits'][0]['_source'])
