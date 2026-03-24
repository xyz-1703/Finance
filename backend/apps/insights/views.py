from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MarketTradeSerializer
from .services import execute_market_trade, get_indian_market_watchlist, get_stock_detail_analysis, get_stock_sentiment


class IndianStocksView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        market = str(request.query_params.get("market", "ALL")).upper()
        per_market = int(request.query_params.get("per_market", "400"))
        per_market = max(1, min(per_market, 500))
        return Response(get_indian_market_watchlist(market=market, per_market=per_market))


class IndianStockDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, symbol: str):
        try:
            payload = get_stock_detail_analysis(symbol.upper())
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(payload)


class MarketTradeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = MarketTradeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            result = execute_market_trade(user=request.user, **serializer.validated_data)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(result, status=status.HTTP_201_CREATED)


class StockSentimentView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, symbol: str):
        try:
            payload = get_stock_sentiment(symbol.upper())
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(payload)
