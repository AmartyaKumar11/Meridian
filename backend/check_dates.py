from elasticsearch import Elasticsearch
from datetime import datetime

es = Elasticsearch(['http://localhost:9200'])

# Get date range of all documents
result = es.search(
    index='stock_news',
    body={
        'size': 0,
        'aggs': {
            'date_range': {
                'stats': {
                    'field': 'seendate'
                }
            }
        }
    }
)

date_stats = result['aggregations']['date_range']
min_date = datetime.fromtimestamp(date_stats['min'] / 1000)
max_date = datetime.fromtimestamp(date_stats['max'] / 1000)

print(f"\nDate range of news events:")
print(f"Earliest: {min_date}")
print(f"Latest: {max_date}")
print(f"Total days: {(max_date - min_date).days}")

# Get count by month
result2 = es.search(
    index='stock_news',
    body={
        'size': 0,
        'aggs': {
            'by_month': {
                'date_histogram': {
                    'field': 'seendate',
                    'calendar_interval': 'month'
                }
            }
        }
    }
)

print("\nEvents by month:")
for bucket in result2['aggregations']['by_month']['buckets']:
    date = datetime.fromtimestamp(bucket['key'] / 1000)
    print(f"{date.strftime('%Y-%m')}: {bucket['doc_count']} events")

# Get sample events with dates
sample = es.search(
    index='stock_news',
    body={
        'size': 10,
        '_source': ['company', 'seendate', 'title'],
        'sort': [{'seendate': {'order': 'asc'}}]
    }
)

print("\nFirst 10 events:")
for hit in sample['hits']['hits']:
    src = hit['_source']
    print(f"{src['seendate']}: {src['company']} - {src['title'][:60]}...")
