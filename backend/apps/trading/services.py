from decimal import Decimal

from django.db import transaction
from django.db.models import F

from apps.accounts.serializers import MpinMixin
from apps.portfolio.models import Portfolio, Holding
from apps.stocks.models import StockMaster

from .models import Transaction


from apps.stocks.services import PriceService

def execute_trade(*, user, portfolio_id: int, stock_id: int, side: str, quantity: Decimal, mpin: str, price: Decimal | None = None) -> Transaction:
    if not MpinMixin.verify_mpin(user, mpin):
        raise ValueError("Invalid MPIN")

    with transaction.atomic():
        portfolio = Portfolio.objects.select_for_update().get(id=portfolio_id, user=user)
        stock = StockMaster.objects.get(id=stock_id)

        if price is None:
            # Fetch live price
            fetched_price = PriceService.get_price(stock.symbol)
            if fetched_price is None:
                raise ValueError(f"Could not fetch live price for {stock.symbol}")
            price = Decimal(str(fetched_price))

        position, _ = Holding.objects.select_for_update().get_or_create(
            portfolio=portfolio,
            stock=stock,
            defaults={"quantity": Decimal("0"), "average_buy_price": Decimal("0")},
        )

        if side == Transaction.BUY:
            total_qty = position.quantity + quantity
            if total_qty > 0:
                weighted_price = ((position.quantity * position.average_buy_price) + (quantity * price)) / total_qty
            else:
                weighted_price = Decimal("0")
            position.quantity = total_qty
            position.average_buy_price = weighted_price
            position.save()
            position.refresh_from_db()

        transaction_record = Transaction.objects.create(
            user=user,
            portfolio=portfolio,
            stock=stock,
            side=side,
            quantity=quantity,
            price=price,
        )
        return transaction_record
