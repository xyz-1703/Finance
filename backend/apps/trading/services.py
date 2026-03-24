from decimal import Decimal

from django.db import transaction
from django.db.models import F

from apps.accounts.serializers import MpinMixin
<<<<<<< HEAD
from apps.portfolio.models import Portfolio, Holding
from apps.stocks.models import StockMaster
=======
from apps.portfolio.models import Portfolio, PortfolioStock
from apps.stocks.models import Stock
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba

from .models import Transaction


def execute_trade(*, user, portfolio_id: int, stock_id: int, side: str, quantity: Decimal, price: Decimal, mpin: str) -> Transaction:
    if not MpinMixin.verify_mpin(user, mpin):
        raise ValueError("Invalid MPIN")

    with transaction.atomic():
        portfolio = Portfolio.objects.select_for_update().get(id=portfolio_id, user=user)
        stock = Stock.objects.get(id=stock_id)
<<<<<<< HEAD
        position, _ = Holding.objects.select_for_update().get_or_create(
            portfolio=portfolio,
            symbol=stock.symbol,
            defaults={"quantity": Decimal("0"), "buy_price": Decimal("0")},
=======
        position, _ = PortfolioStock.objects.select_for_update().get_or_create(
            portfolio=portfolio,
            stock=stock,
            defaults={"quantity": Decimal("0"), "average_buy_price": Decimal("0")},
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
        )

        if side == Transaction.BUY:
            total_qty = position.quantity + quantity
            if total_qty > 0:
<<<<<<< HEAD
                weighted_price = ((position.quantity * position.buy_price) + (quantity * price)) / total_qty
            else:
                weighted_price = Decimal("0")
            position.quantity = total_qty
            position.buy_price = weighted_price
            position.save(update_fields=["quantity", "buy_price", "updated_at"])
=======
                weighted_price = ((position.quantity * position.average_buy_price) + (quantity * price)) / total_qty
            else:
                weighted_price = Decimal("0")
            position.quantity = total_qty
            position.average_buy_price = weighted_price
            position.save(update_fields=["quantity", "average_buy_price", "updated_at"])
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
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
