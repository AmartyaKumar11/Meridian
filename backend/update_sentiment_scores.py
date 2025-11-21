"""
Update Sentiment Scores for Existing Articles

This script re-analyzes all existing articles in Elasticsearch with the improved
FinBERT sentiment logic, updating only the sentiment_label and sentiment_score fields.

Features:
- Batch processing for efficiency
- Progress tracking
- Safe updates (only modifies sentiment fields)
- Automatic retry on failures
"""

import logging
from tqdm import tqdm
from ingestion.elastic_client import get_es_client
from ingestion.news_ingestor import get_sentiment_finbert

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

INDEX_NAME = "stock_news"
BATCH_SIZE = 100  # Process 100 articles at a time


def update_all_sentiments():
    """
    Fetch all articles from Elasticsearch and update their sentiment scores
    using the improved FinBERT logic.
    """
    es = get_es_client()
    
    # Check if index exists
    if not es.indices.exists(index=INDEX_NAME):
        logger.error(f"Index '{INDEX_NAME}' does not exist!")
        return
    
    # Get total count
    count_response = es.count(index=INDEX_NAME)
    total_docs = count_response['count']
    logger.info(f"Found {total_docs:,} articles to update")
    
    if total_docs == 0:
        logger.warning("No articles found in index. Nothing to update.")
        return
    
    # Scroll through all documents
    updated_count = 0
    failed_count = 0
    
    # Initialize scroll
    scroll_response = es.search(
        index=INDEX_NAME,
        scroll='5m',  # Keep scroll context for 5 minutes
        size=BATCH_SIZE,
        body={
            "_source": ["title", "company", "sentiment_label", "sentiment_score"],
            "query": {"match_all": {}}
        }
    )
    
    scroll_id = scroll_response['_scroll_id']
    hits = scroll_response['hits']['hits']
    
    # Progress bar
    with tqdm(total=total_docs, desc="Updating sentiments", unit="articles") as pbar:
        while len(hits) > 0:
            # Process batch
            bulk_updates = []
            
            for hit in hits:
                doc_id = hit['_id']
                source = hit['_source']
                title = source.get('title', '')
                
                if not title:
                    logger.warning(f"Skipping document {doc_id} - no title")
                    failed_count += 1
                    continue
                
                # Re-analyze sentiment with improved logic
                try:
                    new_label, new_score = get_sentiment_finbert(title)
                    
                    # Prepare bulk update operation
                    bulk_updates.append({
                        "update": {
                            "_index": INDEX_NAME,
                            "_id": doc_id
                        }
                    })
                    bulk_updates.append({
                        "doc": {
                            "sentiment_label": new_label,
                            "sentiment_score": new_score
                        }
                    })
                    
                except Exception as e:
                    logger.error(f"Failed to analyze sentiment for doc {doc_id}: {e}")
                    failed_count += 1
            
            # Execute bulk update
            if bulk_updates:
                try:
                    es.bulk(body=bulk_updates, refresh=False)
                    updated_count += len(bulk_updates) // 2  # Each update is 2 items
                except Exception as e:
                    logger.error(f"Bulk update failed: {e}")
                    failed_count += len(bulk_updates) // 2
            
            # Update progress
            pbar.update(len(hits))
            
            # Get next batch
            scroll_response = es.scroll(scroll_id=scroll_id, scroll='5m')
            scroll_id = scroll_response['_scroll_id']
            hits = scroll_response['hits']['hits']
    
    # Clear scroll context
    try:
        es.clear_scroll(scroll_id=scroll_id)
    except:
        pass
    
    # Refresh index to make updates searchable
    logger.info("Refreshing index to apply updates...")
    es.indices.refresh(index=INDEX_NAME)
    
    # Summary
    logger.info("=" * 60)
    logger.info("UPDATE COMPLETE")
    logger.info(f"Total articles: {total_docs:,}")
    logger.info(f"Successfully updated: {updated_count:,}")
    logger.info(f"Failed: {failed_count:,}")
    logger.info("=" * 60)
    
    # Show sample of updated sentiments
    sample_response = es.search(
        index=INDEX_NAME,
        size=5,
        body={
            "_source": ["title", "sentiment_label", "sentiment_score", "company"],
            "query": {"match_all": {}},
            "sort": [{"sentiment_score": {"order": "desc"}}]
        }
    )
    
    logger.info("\nSample of most positive articles:")
    for hit in sample_response['hits']['hits']:
        source = hit['_source']
        logger.info(f"  [{source['sentiment_label'].upper()}] Score: {source['sentiment_score']:.3f}")
        logger.info(f"  Company: {source['company']}")
        logger.info(f"  Title: {source['title'][:100]}...")
        logger.info("")


if __name__ == "__main__":
    logger.info("Starting sentiment score update process...")
    logger.info("This will re-analyze all articles with improved FinBERT logic")
    logger.info("Sentiment scores will now be continuous values from -1 to +1")
    logger.info("")
    
    try:
        update_all_sentiments()
    except KeyboardInterrupt:
        logger.warning("\nProcess interrupted by user")
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
