from elasticsearch import Elasticsearch

es = Elasticsearch(['http://localhost:9200'])

# Get total count
count = es.count(index='stock_news')
print(f"\nTotal documents in stock_news: {count['count']}")

# Get all documents to see company names
result = es.search(
    index='stock_news',
    body={
        'size': 100,
        '_source': ['company', 'title', 'seendate']
    }
)

companies = {}
for hit in result['hits']['hits']:
    company = hit['_source'].get('company', 'Unknown')
    if company in companies:
        companies[company] += 1
    else:
        companies[company] = 1

print(f"\nCompanies found (from {len(result['hits']['hits'])} documents):")
print('-' * 60)
for company, count in sorted(companies.items(), key=lambda x: x[1], reverse=True):
    print(f"{company}: {count} articles")

# Test the API query for "AXIS BANK"
print("\n\nTesting query for 'AXIS BANK':")
test_result = es.search(
    index='stock_news',
    body={
        'size': 5,
        'query': {'match': {'company': 'AXIS BANK'}}
    }
)
print(f"Found {test_result['hits']['total']['value']} results")

# Test for "Axis Bank"
print("\nTesting query for 'Axis Bank':")
test_result2 = es.search(
    index='stock_news',
    body={
        'size': 5,
        'query': {'match': {'company': 'Axis Bank'}}
    }
)
print(f"Found {test_result2['hits']['total']['value']} results")
if test_result2['hits']['hits']:
    print("Sample:", test_result2['hits']['hits'][0]['_source']['company'])
