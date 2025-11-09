"""
Redis Cache Client for News Events

Purpose:
    Provides caching layer for news events to optimize chart marker performance.
    Stores events in Redis with automatic expiration for freshness.

Usage:
    cache = get_redis_client()
    cache.set_news_events("RELIANCE.NS", events_data, ttl=3600)
    cached_events = cache.get_news_events("RELIANCE.NS")
"""

import json
import logging
import os
from typing import Optional, List, Dict, Any
import redis
from redis.exceptions import RedisError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class NewsCache:
    """Redis cache manager for news events."""
    
    def __init__(self, host: str = "localhost", port: int = 6379, db: int = 0):
        """
        Initialize Redis connection.
        
        Args:
            host: Redis server host
            port: Redis server port
            db: Redis database number
        """
        try:
            self.redis_client = redis.Redis(
                host=host,
                port=port,
                db=db,
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5
            )
            # Test connection
            self.redis_client.ping()
            logger.info(f"Successfully connected to Redis at {host}:{port}")
            self.enabled = True
        except RedisError as e:
            logger.warning(f"Redis not available: {e}. Caching disabled.")
            self.enabled = False
            self.redis_client = None
    
    def _get_events_key(self, company: str) -> str:
        """Generate Redis key for company news events."""
        return f"news:events:{company}"
    
    def _get_event_detail_key(self, company: str, timestamp: str) -> str:
        """Generate Redis key for specific event details."""
        return f"news:event:{company}:{timestamp}"
    
    def set_news_events(
        self, 
        company: str, 
        events: List[Dict[str, Any]], 
        ttl: int = 3600
    ) -> bool:
        """
        Cache news events for a company.
        
        Args:
            company: Company name/symbol
            events: List of event dictionaries
            ttl: Time to live in seconds (default: 1 hour)
            
        Returns:
            bool: True if cached successfully, False otherwise
        """
        if not self.enabled:
            return False
        
        try:
            # Store the full events list
            events_key = self._get_events_key(company)
            self.redis_client.setex(
                events_key,
                ttl,
                json.dumps(events)
            )
            
            # Also cache individual event details for quick lookup
            for event in events:
                timestamp = event.get("timestamp")
                if timestamp:
                    detail_key = self._get_event_detail_key(company, timestamp)
                    self.redis_client.setex(
                        detail_key,
                        ttl,
                        json.dumps(event)
                    )
            
            logger.info(f"Cached {len(events)} events for {company} (TTL: {ttl}s)")
            return True
            
        except RedisError as e:
            logger.error(f"Error caching events for {company}: {e}")
            return False
    
    def get_news_events(self, company: str) -> Optional[List[Dict[str, Any]]]:
        """
        Get cached news events for a company.
        
        Args:
            company: Company name/symbol
            
        Returns:
            List of events or None if not cached
        """
        if not self.enabled:
            return None
        
        try:
            events_key = self._get_events_key(company)
            cached_data = self.redis_client.get(events_key)
            
            if cached_data:
                logger.info(f"Cache hit for {company} events")
                return json.loads(cached_data)
            else:
                logger.info(f"Cache miss for {company} events")
                return None
                
        except RedisError as e:
            logger.error(f"Error retrieving cached events for {company}: {e}")
            return None
    
    def get_event_detail(
        self, 
        company: str, 
        timestamp: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get cached detail for a specific event.
        
        Args:
            company: Company name/symbol
            timestamp: Event timestamp
            
        Returns:
            Event detail dict or None if not cached
        """
        if not self.enabled:
            return None
        
        try:
            detail_key = self._get_event_detail_key(company, timestamp)
            cached_data = self.redis_client.get(detail_key)
            
            if cached_data:
                logger.debug(f"Cache hit for event at {timestamp}")
                return json.loads(cached_data)
            else:
                logger.debug(f"Cache miss for event at {timestamp}")
                return None
                
        except RedisError as e:
            logger.error(f"Error retrieving event detail: {e}")
            return None
    
    def invalidate_company(self, company: str) -> bool:
        """
        Invalidate all cached data for a company.
        
        Args:
            company: Company name/symbol
            
        Returns:
            bool: True if invalidated successfully
        """
        if not self.enabled:
            return False
        
        try:
            # Delete main events list
            events_key = self._get_events_key(company)
            self.redis_client.delete(events_key)
            
            # Delete all event details (using pattern matching)
            pattern = f"news:event:{company}:*"
            cursor = 0
            deleted_count = 0
            
            while True:
                cursor, keys = self.redis_client.scan(
                    cursor=cursor,
                    match=pattern,
                    count=100
                )
                if keys:
                    self.redis_client.delete(*keys)
                    deleted_count += len(keys)
                if cursor == 0:
                    break
            
            logger.info(f"Invalidated cache for {company} ({deleted_count} keys deleted)")
            return True
            
        except RedisError as e:
            logger.error(f"Error invalidating cache for {company}: {e}")
            return False
    
    def get_cache_stats(self) -> Dict[str, Any]:
        """
        Get cache statistics.
        
        Returns:
            Dict with cache stats
        """
        if not self.enabled:
            return {"enabled": False}
        
        try:
            info = self.redis_client.info()
            return {
                "enabled": True,
                "used_memory_human": info.get("used_memory_human"),
                "connected_clients": info.get("connected_clients"),
                "total_commands_processed": info.get("total_commands_processed"),
                "keyspace_hits": info.get("keyspace_hits", 0),
                "keyspace_misses": info.get("keyspace_misses", 0),
            }
        except RedisError as e:
            logger.error(f"Error getting cache stats: {e}")
            return {"enabled": True, "error": str(e)}


# Global cache instance
_cache_instance: Optional[NewsCache] = None


def get_redis_client() -> NewsCache:
    """
    Get or create Redis cache client instance.
    
    Returns:
        NewsCache: Redis cache instance
    """
    global _cache_instance
    
    if _cache_instance is None:
        redis_host = os.getenv("REDIS_HOST", "localhost")
        redis_port = int(os.getenv("REDIS_PORT", "6379"))
        redis_db = int(os.getenv("REDIS_DB", "0"))
        
        _cache_instance = NewsCache(
            host=redis_host,
            port=redis_port,
            db=redis_db
        )
    
    return _cache_instance
