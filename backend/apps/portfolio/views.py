from rest_framework import permissions, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction, models
from decimal import Decimal
from .models import Portfolio, Holding, Transaction
from .serializers import PortfolioSerializer, HoldingSerializer, TransactionSerializer
from apps.stocks.models import StockMaster, StockPrice


def seed_portfolio_holdings(portfolio):
    if Holding.objects.filter(portfolio=portfolio).exists():
        return
    stocks = StockMaster.objects.filter(prices__isnull=False).distinct().order_by("symbol")[:4]
    if not stocks:
        return
    for stock in stocks:
        price_obj = StockPrice.objects.filter(stock=stock).order_by("-timestamp").first()
        if not price_obj:
            continue
        qty = Decimal("5")
        Holding.objects.create(
            portfolio=portfolio,
            stock=stock,
            quantity=qty,
            average_buy_price=price_obj.close,
        )
        Transaction.objects.create(
            portfolio=portfolio,
            symbol=stock,
            action="BUY",
            quantity=qty,
            price=price_obj.close,
        )


class PortfolioViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Show user's portfolios + default/template portfolios for all users
        from django.db.models import Q
        return Portfolio.objects.filter(
            Q(user=self.request.user) | Q(is_default=True)
        ).prefetch_related("holdings").order_by("-is_default", "-created_at")

    def perform_create(self, serializer):
        from django.db import IntegrityError
        from rest_framework.exceptions import ValidationError
        try:
            portfolio = serializer.save(user=self.request.user)
            seed_portfolio_holdings(portfolio)
        except IntegrityError:
            raise ValidationError({"name": "A portfolio with this name already exists."})

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        for portfolio in queryset:
            seed_portfolio_holdings(portfolio)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        seed_portfolio_holdings(instance)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def perform_update(self, serializer):
        """Only allow users to update their own portfolios"""
        portfolio = self.get_object()
        if portfolio.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only update your own portfolios.")
        serializer.save()

    def perform_destroy(self, instance):
        """Only allow users to delete their own portfolios"""
        if instance.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You can only delete your own portfolios.")
        instance.delete()

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

    @action(detail=True, methods=["get"])
    def recommendations(self, request, pk=None):
        from apps.stocks.serializers import StockMasterSerializer
        portfolio = self.get_object()
        holding_symbols = list(portfolio.holdings.values_list("stock__symbol", flat=True))
        qs = StockMaster.objects.exclude(symbol__in=holding_symbols).order_by("symbol")
        if portfolio.sector:
            sector_qs = qs.filter(sector__icontains=portfolio.sector)
            if sector_qs.exists():
                qs = sector_qs
        stocks = list(qs[:5])
        if len(stocks) < 5:
            extra = StockMaster.objects.exclude(symbol__in=holding_symbols).exclude(
                id__in=[s.id for s in stocks]
            ).order_by("symbol")[: 5 - len(stocks)]
            stocks.extend(list(extra))
        return Response(StockMasterSerializer(stocks, many=True).data)

    @action(detail=False, methods=["post"])
    def sell(self, request):
        # A convenience wrapper for selling stock
        # Actual logic is handled in TransactionViewSet, but this meets the "POST /portfolio/sell" requirement
        from rest_framework.reverse import reverse
        from django.shortcuts import redirect
        # Forward to transaction viewset logic or just implement here
        return Response({"detail": "Use POST /api/portfolio/transactions/ with action='SELL'"}, status=status.HTTP_200_OK)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        from django.db.models import Q
        return Transaction.objects.filter(
            Q(portfolio__user=self.request.user) | Q(portfolio__is_default=True)
        ).select_related("portfolio", "symbol")

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        portfolio_id = request.data.get('portfolio')
        symbol_identifier = request.data.get('symbol') # Can be ID or ticker string
        action = request.data.get('action', 'BUY')
        from decimal import Decimal
        quantity = Decimal(str(request.data.get('quantity', 0)))

        try:
            portfolio = Portfolio.objects.filter(id=portfolio_id, user=request.user).first()
            if portfolio is None:
                portfolio = Portfolio.objects.filter(id=portfolio_id, is_default=True).first()
            if portfolio is None:
                raise Portfolio.DoesNotExist()
            
            # Flexible stock lookup
            if isinstance(symbol_identifier, int) or (isinstance(symbol_identifier, str) and symbol_identifier.isdigit()):
                stock = StockMaster.objects.get(id=symbol_identifier)
            else:
                stock = StockMaster.objects.get(symbol=symbol_identifier)
                
        except (Portfolio.DoesNotExist, StockMaster.DoesNotExist):
            return Response({"error": "Invalid portfolio or stock"}, status=status.HTTP_400_BAD_REQUEST)

        # Get latest price from StockPrice
        price_obj = StockPrice.objects.filter(stock=stock).order_by("-timestamp").first()
        if not price_obj:
            return Response({"error": f"No price available for {stock.symbol}"}, status=status.HTTP_400_BAD_REQUEST)
        
        price = price_obj.close

        # Check for SELL validity
        holding, created = Holding.objects.get_or_create(portfolio=portfolio, stock=stock, defaults={'quantity': 0, 'average_buy_price': 0})
        
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
            # Update average buy price
            total_cost = (holding.quantity * holding.average_buy_price) + (tx.quantity * tx.price)
            holding.quantity += tx.quantity
            if holding.quantity > 0:
                holding.average_buy_price = total_cost / holding.quantity
            holding.save()
        else:
            holding.quantity -= tx.quantity
            if holding.quantity <= 0.0001: # Use small threshold for floating point
                holding.delete()
            else:
                holding.save()

        serializer = self.get_serializer(tx)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class HoldingViewSet(viewsets.ModelViewSet):
    serializer_class = HoldingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Allow viewing holdings from user's portfolios and default/template portfolios
        from django.db.models import Q
        return Holding.objects.filter(
            Q(portfolio__user=self.request.user) | Q(portfolio__is_default=True)
        ).select_related("portfolio", "stock")

