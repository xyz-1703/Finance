from apps.accounts.models import User
from apps.accounts.serializers import MpinMixin
from apps.trading.services import execute_trade
from apps.portfolio.models import Portfolio, Holding
from apps.stocks.models import StockMaster
from decimal import Decimal

def verify():
    user = User.objects.filter(email="anuj@gmail.com").first()
    if not user:
        print("User anuj@gmail.com not found")
        return

    # Set MPIN to 1234
    MpinMixin.set_mpin(user, "1234")
    print("MPIN set to 1234 for anuj@gmail.com")

    # Get a portfolio and a stock
    portfolio = user.portfolios.first()
    if not portfolio:
        portfolio = Portfolio.objects.create(user=user, name="Main Portfolio")
    
    stock = StockMaster.objects.get(symbol="RELIANCE.NS")
    
    # Check if we have price for RELIANCE.NS in StockPrice model
    from apps.stocks.models import StockPrice
    latest_price = StockPrice.objects.filter(stock=stock).order_by("-timestamp").first()
    print(f"Latest price in DB for {stock.symbol}: {latest_price.close if latest_price else 'No price in DB'}")

    print(f"Executing trade for {stock.symbol} in portfolio {portfolio.name}...")
    
    try:
        # Execute trade without price
        trade = execute_trade(
            user=user,
            portfolio_id=portfolio.id,
            stock_id=stock.id,
            side="BUY",
            quantity=Decimal("10"),
            mpin="1234"
        )
        print(f"Trade successful! Executed price: {trade.price}")
        
        # Verify holding
        holding = Holding.objects.get(portfolio=portfolio, stock=stock)
        print(f"Holding updated: Quantity={holding.quantity}, Avg Price={holding.average_buy_price}")
        
    except Exception as e:
        import traceback
        print(f"Trade failed: {e}")
        traceback.print_exc()

verify()
