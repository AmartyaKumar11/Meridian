from elasticsearch import Elasticsearch, exceptions

ES_HOST = "http://localhost:9200"

def get_es_client():
    es = Elasticsearch(ES_HOST)
    if not es.ping():
        raise ValueError(f"Could not connect to Elasticsearch at {ES_HOST}")
    return es

def index_document(es, index_name, doc):
    """
    Index a JSON document into the specified index.
    Args:
        es: Elasticsearch client instance
        index_name: Name of the index (str)
        doc: Document (dict)
    Returns:
        Elasticsearch response dict
    """
    return es.index(index=index_name, document=doc)
