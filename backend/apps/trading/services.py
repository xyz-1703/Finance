from decimal import Decimal

from django.db import transaction
from django.db.models import F

from apps.accounts.serializers import MpinMixin
from apps.portfolio.models import Portfolio, Holding
from apps.stocks.models import StockMaster

from .models import Transaction


def execute_trade(*, user, portfolio_id: int, stock_id: int, side: str, quantity: Decimal, price: Decimal, mpin: str) -> Transaction:
    if not MpinMixin.verify_mpin(user, mpin):
        raise ValueError("Invalid MPIN")

    with transaction.atomic():
        portfolio = Portfolio.objects.select_for_update().get(id=portfolio_id, user=user)
        stock = Stock.objects.get(id=stock_id)
        position, _ = Holding.objects.select_for_update().get_or_create(
            portfolio=portfolio,
            symbol=stock.symbol,
            defaults={"quantity": Decimal("0"), "buy_price": Decimal("0")},
        )

        if side == Transaction.BUY:
            total_qty = position.quantity + quantity
            if total_qty > 0:
                weighted_price = ((position.quantity * position.buy_price) + (quantity * price)) / total_qty
            else:
                weighted_price = Decimal("0")
            position.quantity = total_qty
            position.buy_price = weighted_price
            position.save(update_fields=["quantity", "buy_price", "updated_at"])
        else:
            if position.quantity < quantity:
                raise ValueError("Insufficient holdings")
            position.quantity = F("quantity") - quantity
            position.save(update_fields=["quantity", "updated_at"])
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
