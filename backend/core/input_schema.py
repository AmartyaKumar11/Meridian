from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import date

class PortfolioInput(BaseModel):
    # Core parameters with validation
    start_date: date
    end_date: date
    risk_appetite: Literal["Conservative", "Moderate", "Aggressive"]
    target_return: float = Field(ge=0, le=100)  # 0-100%
    initial_capital: float = Field(ge=10000)    # Min ₹10k
    inflation_rate: float = Field(default=6.0, ge=0, le=15)
    
    # Constraints
    max_weight_per_stock: float = Field(default=0.20, ge=0.01, le=0.50)
    min_weight_per_stock: float = Field(default=0.02, ge=0, le=0.10)
    min_stocks: int = Field(default=10, ge=5, le=50)
    max_stocks: int = Field(default=30, ge=10, le=100)
    
    # Sectors
    include_sectors: Optional[List[str]] = None
    exclude_sectors: Optional[List[str]] = None
    
    # Advanced
    optimization_method: str = Field(default="max_sharpe")
    rebalancing_frequency: str = Field(default="Quarterly")
    transaction_cost_pct: float = Field(default=0.001, ge=0, le=0.05)
    
    # Stock Universe
    stock_universe: Literal["NIFTY50", "NIFTY500", "CUSTOM"] = "NIFTY50"
    custom_tickers: Optional[List[str]] = []
