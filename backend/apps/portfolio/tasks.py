from celery import shared_task
from .models import Portfolio
from .automation import rebalance_portfolio

@shared_task
def run_auto_rebalancing():
    """
    Periodic task to rebalance all automated portfolios.
    """
    automated_portfolios = Portfolio.objects.filter(is_automated=True)
    results = []
    for p in automated_portfolios:
        try:
            trades = rebalance_portfolio(p.id)
            if trades:
                results.append(f"Rebalanced portfolio {p.id}: {len(trades)} trades")
        except Exception as e:
            results.append(f"Failed to rebalance {p.id}: {str(e)}")
    return results
