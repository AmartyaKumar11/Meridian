import math
from typing import Dict, Any

class PostProcessor:
    def __init__(self, initial_capital: float, transaction_cost_pct: float = 0.001):
        self.initial_capital = initial_capital
        self.transaction_cost_pct = transaction_cost_pct

    def process_weights(self, weights: Dict[str, float], current_prices: Dict[str, float]) -> Dict[str, Any]:
        """
        Convert theoretical weights to actual positions with integer shares.
        """
        positions = []
        total_invested = 0
        total_transaction_costs = 0
        
        for ticker, weight in weights.items():
            if weight <= 0:
                continue
                
            price = current_prices.get(ticker, 0)
            if price <= 0:
                continue
                
            # Theoretical allocation
            allocation = weight * self.initial_capital
            
            # Adjust for transaction costs
            # allocation = invested + invested * cost_pct
            # invested = allocation / (1 + cost_pct)
            net_allocation = allocation / (1 + self.transaction_cost_pct)
            
            # Calculate shares (floor)
            shares = math.floor(net_allocation / price)
            
            if shares > 0:
                invested_amount = shares * price
                transaction_cost = invested_amount * self.transaction_cost_pct
                
                positions.append({
                    "ticker": ticker,
                    "weight_theoretical": weight,
                    "weight_actual": 0, # Will calculate after total
                    "shares": shares,
                    "price": price,
                    "invested_amount": invested_amount,
                    "transaction_cost": transaction_cost
                })
                
                total_invested += invested_amount
                total_transaction_costs += transaction_cost
        
        # Recalculate actual weights
        for pos in positions:
            pos["weight_actual"] = pos["invested_amount"] / self.initial_capital
            
        leftover_cash = self.initial_capital - total_invested - total_transaction_costs
        
        return {
            "positions": positions,
            "summary": {
                "total_invested": total_invested,
                "total_transaction_costs": total_transaction_costs,
                "leftover_cash": leftover_cash,
                "initial_capital": self.initial_capital
            }
        }
