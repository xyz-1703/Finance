<<<<<<< HEAD
from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction, models
from .models import Portfolio, Holding, Transaction
from .serializers import PortfolioSerializer, HoldingSerializer, TransactionSerializer
from apps.stocks.models import StockMaster, StockPrice
=======
from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from .models import Portfolio, PortfolioStock
from .serializers import PortfolioSerializer, PortfolioStockSerializer

>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba

class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user).prefetch_related("holdings")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

<<<<<<< HEAD
    @action(detail=True, methods=["post"])
    def rebalance(self, request, pk=None):
        from .automation import rebalance_portfolio
        try:
            trades = rebalance_portfolio(pk)
            return Response({"status": "success", "trades": trades})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def suggest_diversified(self, request):
        from .automation import suggest_diversified_portfolio
        from apps.stocks.serializers import StockMasterSerializer
        stocks = suggest_diversified_portfolio(request.user)
        return Response(StockMasterSerializer(stocks, many=True).data)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(portfolio__user=self.request.user).select_related("portfolio", "symbol")

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        portfolio_id = request.data.get('portfolio')
        symbol_identifier = request.data.get('symbol') # Can be ID or ticker string
        action = request.data.get('action', 'BUY')
        quantity = float(request.data.get('quantity', 0))

        try:
            portfolio = Portfolio.objects.get(id=portfolio_id, user=request.user)
            
            # Flexible stock lookup
            if isinstance(symbol_identifier, int) or (isinstance(symbol_identifier, str) and symbol_identifier.isdigit()):
                stock = StockMaster.objects.get(id=symbol_identifier)
            else:
                stock = StockMaster.objects.get(symbol=symbol_identifier)
                
        except (Portfolio.DoesNotExist, StockMaster.DoesNotExist):
            return Response({"error": "Invalid portfolio or stock"}, status=status.HTTP_400_BAD_REQUEST)

        # Get latest price from StockPrice
        price_obj = StockPrice.objects.filter(stock=stock).first()
        if not price_obj:
            return Response({"error": f"No price available for {stock.symbol}"}, status=status.HTTP_400_BAD_REQUEST)
        
        price = price_obj.price

        # Check for SELL validity
        holding, created = Holding.objects.get_or_create(portfolio=portfolio, stock=stock, defaults={'quantity': 0})
        
        if action == 'SELL' and holding.quantity < quantity:
            return Response({"error": "Insufficient quantity to sell"}, status=status.HTTP_400_BAD_REQUEST)

        # Create transaction
        tx = Transaction.objects.create(
            portfolio=portfolio,
            symbol=stock,
            action=action,
            quantity=quantity,
            price=price
        )

        # Update holding
        if action == 'BUY':
            holding.quantity += tx.quantity
        else:
            holding.quantity -= tx.quantity
        holding.save()

        serializer = self.get_serializer(tx)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class HoldingViewSet(viewsets.ModelViewSet):
    serializer_class = HoldingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Holding.objects.filter(portfolio__user=self.request.user).select_related("portfolio", "stock")
=======

class PortfolioStockViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioStockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PortfolioStock.objects.filter(portfolio__user=self.request.user).select_related("portfolio", "stock")

    def perform_create(self, serializer):
        portfolio = serializer.validated_data.get("portfolio")
        if portfolio.user_id != self.request.user.id:
            raise PermissionDenied("Portfolio does not belong to user")
        serializer.save()
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
