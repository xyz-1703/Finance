from celery import shared_task

from .services import ALLOWED_NSE_SYMBOLS, ALLOWED_US_SYMBOLS, refresh_watchlist_cache


@shared_task(bind=True, name="apps.insights.tasks.refresh_market_watchlist_cache")
def refresh_market_watchlist_cache(self):
    payload = refresh_watchlist_cache()
    payload["task_id"] = self.request.id
    return payload


@shared_task(bind=True, name="apps.insights.tasks.bootstrap_market_watchlist_cache")
def bootstrap_market_watchlist_cache(self):
    # Bootstrap once with the complete configured universe to prime DB snapshots.
    payload = refresh_watchlist_cache(price_snapshot_limit=len(ALLOWED_NSE_SYMBOLS + ALLOWED_US_SYMBOLS))
    payload["task_id"] = self.request.id
    payload["mode"] = "bootstrap"
    return payload
