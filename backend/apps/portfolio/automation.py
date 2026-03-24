from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from apps.mlops.models import StockCluster
from apps.stocks.models import StockMaster, StockPrice
from .models import Portfolio, Holding, Transaction

def suggest_diversified_portfolio(user, n_stocks=5):
    """
    Suggests a diversified portfolio by picking the top stock (highest market cap) 
    from each distinct cluster.
    """
    clusters = StockCluster.objects.all().order_by('-stock__symbol') # Simple order
    
    unique_clusters = {}
    for c in clusters:
        if c.cluster_label not in unique_clusters:
            unique_clusters[c.cluster_label] = c.stock
            
    suggested_stocks = list(unique_clusters.values())[:n_stocks]
    return suggested_stocks

def rebalance_portfolio(portfolio_id):
    """
    Calculates the trades needed to reach the target allocation.
    target_allocation example: {"AAPL": 40, "TSLA": 60}
    """
    with transaction.atomic():
        portfolio = Portfolio.objects.select_for_update().get(id=portfolio_id)
        if not portfolio.is_automated or not portfolio.target_allocation:
            return []

        # 1. Calculate current total value
        holdings = portfolio.holdings.all()
        total_value = Decimal("0")
        current_prices = {}
        
        for h in holdings:
            price_obj = StockPrice.objects.filter(symbol=h.stock.symbol).order_by('-updated_at').first()
            price = price_obj.price if price_obj else Decimal("0")
            current_prices[h.stock.symbol] = price
            total_value += h.quantity * price

        if total_value == 0:
            return [] # Cannot rebalance an empty or zero-value portfolio

        # 2. Compare with target allocation
        trades = []
        for symbol, target_pct in portfolio.target_allocation.items():
            stock = StockMaster.objects.get(symbol=symbol)
            target_value = (Decimal(str(target_pct)) / Decimal("100")) * total_value
            
            holding = holdings.filter(stock=stock).first()
            current_qty = holding.quantity if holding else Decimal("0")
            current_price = current_prices.get(symbol) or StockPrice.objects.filter(symbol=symbol).order_by('-updated_at').first().price
            
            current_value = current_qty * current_price
            diff_value = target_value - current_value
            
            if abs(diff_value) > 1: # Threshold to avoid tiny trades
                diff_qty = diff_value / current_price
                action = 'BUY' if diff_qty > 0 else 'SELL'
                
                # Create the transaction
                Transaction.objects.create(
                    portfolio=portfolio,
                    symbol=stock,
                    action=action,
                    quantity=abs(diff_qty),
                    price=current_price
                )
                
                # Update holding
                if holding:
                    holding.quantity += diff_qty
                    holding.save()
                else:
                    Holding.objects.create(portfolio=portfolio, stock=stock, quantity=diff_qty)
                
                trades.append({
                    "symbol": symbol,
                    "action": action,
                    "quantity": float(abs(diff_qty)),
                    "price": float(current_price)
                })
        
        return trades
