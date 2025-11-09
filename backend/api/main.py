"""
FastAPI Backend for News Analytics Dashboard

PURPOSE:
    Serves news sentiment data from Elasticsearch to React frontend.
    Provides endpoints for sentiment analysis, correlation graphs, and event impact.

ENDPOINTS:
    GET /api/health - Health check
    GET /api/companies - List all companies with data
    GET /api/news/{company} - Get news articles for a company
    GET /api/sentiment/{company} - Get sentiment timeline
    GET /api/correlation/{company} - Get news-to-price correlation
    GET /api/impact-events/{company} - Get high-impact news events
    GET /api/sentiment-distribution - Get overall sentiment distribution

USAGE:
    uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from ingestion.elastic_client import get_es_client

# Initialize FastAPI app
app = FastAPI(
    title="News Analytics API",
    description="REST API for NIFTY50 news sentiment analysis",
    version="1.0.0"
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Elasticsearch client
es = None

@app.on_event("startup")
async def startup_event():
    """Initialize Elasticsearch connection on startup."""
    global es
    es = get_es_client()


# Pydantic models
class NewsArticle(BaseModel):
    title: str
    url: str
    company: str
    sentiment_label: str
    sentiment_score: float
    seendate: Optional[str]
    domain: str
    language: str
    sourceCountry: str
    impact_score: float


class SentimentPoint(BaseModel):
    date: str
    sentiment_avg: float
    article_count: int
    positive_count: int
    negative_count: int
    neutral_count: int


class CompanyInfo(BaseModel):
    name: str
    article_count: int
    avg_sentiment: float
    latest_article_date: Optional[str]


# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Check API and Elasticsearch health."""
    try:
        es_info = es.info()
        return {
            "status": "healthy",
            "elasticsearch": {
                "connected": True,
                "cluster": es_info.get("cluster_name"),
                "version": es_info.get("version", {}).get("number")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Elasticsearch connection failed: {str(e)}")


# Get all companies with data
@app.get("/api/companies", response_model=List[CompanyInfo])
async def get_companies():
    """Get list of all companies with article counts and avg sentiment."""
    try:
        query = {
            "size": 0,
            "aggs": {
                "companies": {
                    "terms": {
                        "field": "company",
                        "size": 100
                    },
                    "aggs": {
                        "avg_sentiment": {
                            "avg": {
                                "field": "sentiment_score"
                            }
                        },
                        "latest_date": {
                            "max": {
                                "field": "seendate"
                            }
                        }
                    }
                }
            }
        }
        
        result = es.search(index="stock_news", body=query)
        
        companies = []
        for bucket in result['aggregations']['companies']['buckets']:
            companies.append(CompanyInfo(
                name=bucket['key'],
                article_count=bucket['doc_count'],
                avg_sentiment=bucket['avg_sentiment']['value'] or 0.5,
                latest_article_date=bucket['latest_date']['value_as_string'] if bucket['latest_date']['value'] else None
            ))
        
        # Sort by article count descending
        companies.sort(key=lambda x: x.article_count, reverse=True)
        
        return companies
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get news articles for a company
@app.get("/api/news/{company}")
async def get_company_news(
    company: str,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    sentiment: Optional[str] = Query(None, regex="^(positive|negative|neutral)$"),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """
    Get news articles for a specific company.
    
    Args:
        company: Company name
        limit: Number of articles to return (default: 50, max: 500)
        offset: Pagination offset (default: 0)
        sentiment: Filter by sentiment (positive/negative/neutral)
        start_date: Start date filter (ISO format)
        end_date: End date filter (ISO format)
    """
    try:
        # Build query
        must_conditions = [
            {"match": {"company": company}}
        ]
        
        if sentiment:
            must_conditions.append({"term": {"sentiment_label": sentiment}})
        
        if start_date or end_date:
            date_range = {}
            if start_date:
                date_range["gte"] = start_date
            if end_date:
                date_range["lte"] = end_date
            must_conditions.append({"range": {"seendate": date_range}})
        
        query = {
            "from": offset,
            "size": limit,
            "query": {
                "bool": {
                    "must": must_conditions
                }
            },
            "sort": [
                {"seendate": {"order": "desc"}},
                {"sentiment_score": {"order": "desc"}}
            ]
        }
        
        result = es.search(index="stock_news", body=query)
        
        articles = []
        for hit in result['hits']['hits']:
            doc = hit['_source']
            articles.append({
                "title": doc.get("title"),
                "url": doc.get("url"),
                "company": doc.get("company"),
                "sentiment_label": doc.get("sentiment_label"),
                "sentiment_score": doc.get("sentiment_score"),
                "seendate": doc.get("seendate"),
                "domain": doc.get("domain"),
                "language": doc.get("language"),
                "sourceCountry": doc.get("sourceCountry"),
                "impact_score": doc.get("impact_score", 0.0)
            })
        
        return {
            "total": result['hits']['total']['value'],
            "articles": articles,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get sentiment timeline for a company
@app.get("/api/sentiment/{company}", response_model=List[SentimentPoint])
async def get_sentiment_timeline(
    company: str,
    interval: str = Query("1w", regex="^(1d|1w|1M)$"),
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """
    Get sentiment timeline aggregated by interval.
    
    Args:
        company: Company name
        interval: Aggregation interval (1d=daily, 1w=weekly, 1M=monthly)
        start_date: Start date filter (ISO format)
        end_date: End date filter (ISO format)
    """
    try:
        # Build query
        must_conditions = [{"match": {"company": company}}]
        
        if start_date or end_date:
            date_range = {}
            if start_date:
                date_range["gte"] = start_date
            if end_date:
                date_range["lte"] = end_date
            must_conditions.append({"range": {"seendate": date_range}})
        
        query = {
            "size": 0,
            "query": {
                "bool": {
                    "must": must_conditions
                }
            },
            "aggs": {
                "timeline": {
                    "date_histogram": {
                        "field": "seendate",
                        "calendar_interval": interval,
                        "min_doc_count": 1
                    },
                    "aggs": {
                        "avg_sentiment": {
                            "avg": {"field": "sentiment_score"}
                        },
                        "sentiment_breakdown": {
                            "terms": {"field": "sentiment_label"}
                        }
                    }
                }
            }
        }
        
        result = es.search(index="stock_news", body=query)
        
        timeline = []
        for bucket in result['aggregations']['timeline']['buckets']:
            # Count sentiments
            sentiment_counts = {
                "positive": 0,
                "negative": 0,
                "neutral": 0
            }
            for sent_bucket in bucket['sentiment_breakdown']['buckets']:
                sentiment_counts[sent_bucket['key']] = sent_bucket['doc_count']
            
            timeline.append(SentimentPoint(
                date=bucket['key_as_string'],
                sentiment_avg=bucket['avg_sentiment']['value'] or 0.5,
                article_count=bucket['doc_count'],
                positive_count=sentiment_counts['positive'],
                negative_count=sentiment_counts['negative'],
                neutral_count=sentiment_counts['neutral']
            ))
        
        return timeline
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get high-impact news events
@app.get("/api/impact-events/{company}")
async def get_impact_events(
    company: str,
    limit: int = Query(20, ge=1, le=100),
    min_impact_score: float = Query(0.05, ge=0.0, le=1.0)
):
    """
    Get high-impact news events sorted by impact score.
    
    Args:
        company: Company name
        limit: Number of events to return
        min_impact_score: Minimum impact score threshold
    """
    try:
        query = {
            "size": limit,
            "query": {
                "bool": {
                    "must": [
                        {"match": {"company": company}}
                    ],
                    "filter": [
                        {"range": {"impact_score": {"gte": min_impact_score}}}
                    ]
                }
            },
            "sort": [
                {"impact_score": {"order": "desc"}},
                {"sentiment_score": {"order": "desc"}}
            ]
        }
        
        result = es.search(index="stock_news", body=query)
        
        events = []
        for hit in result['hits']['hits']:
            doc = hit['_source']
            events.append({
                "title": doc.get("title"),
                "url": doc.get("url"),
                "sentiment_label": doc.get("sentiment_label"),
                "sentiment_score": doc.get("sentiment_score"),
                "impact_score": doc.get("impact_score"),
                "seendate": doc.get("seendate"),
                "price_change_pct": doc.get("price_change_pct"),
                "domain": doc.get("domain")
            })
        
        return {
            "company": company,
            "total_high_impact": result['hits']['total']['value'],
            "events": events
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Get overall sentiment distribution
@app.get("/api/sentiment-distribution")
async def get_sentiment_distribution(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None
):
    """Get overall sentiment distribution across all companies."""
    try:
        must_conditions = []
        
        if start_date or end_date:
            date_range = {}
            if start_date:
                date_range["gte"] = start_date
            if end_date:
                date_range["lte"] = end_date
            must_conditions.append({"range": {"seendate": date_range}})
        
        query = {
            "size": 0,
            "query": {
                "bool": {
                    "must": must_conditions
                } if must_conditions else {"match_all": {}}
            },
            "aggs": {
                "sentiments": {
                    "terms": {"field": "sentiment_label"}
                },
                "avg_sentiment_score": {
                    "avg": {"field": "sentiment_score"}
                },
                "companies": {
                    "terms": {
                        "field": "company",
                        "size": 10
                    },
                    "aggs": {
                        "avg_sentiment": {
                            "avg": {"field": "sentiment_score"}
                        }
                    }
                }
            }
        }
        
        result = es.search(index="stock_news", body=query)
        
        sentiment_counts = {}
        for bucket in result['aggregations']['sentiments']['buckets']:
            sentiment_counts[bucket['key']] = bucket['doc_count']
        
        top_companies = []
        for bucket in result['aggregations']['companies']['buckets']:
            top_companies.append({
                "company": bucket['key'],
                "article_count": bucket['doc_count'],
                "avg_sentiment": bucket['avg_sentiment']['value']
            })
        
        return {
            "total_articles": result['hits']['total']['value'],
            "sentiment_counts": sentiment_counts,
            "avg_sentiment_score": result['aggregations']['avg_sentiment_score']['value'],
            "top_companies": top_companies
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
