from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MarketTradeSerializer
from .services import (
    execute_market_trade, get_indian_market_watchlist, 
    get_stock_detail_analysis, get_stock_sentiment
)
from .models import MarketStockSnapshot
from apps.chatbot.services import ask_llm
from apps.portfolio.models import Holding
import json


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


class RecommendationAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        risk_profile = request.query_params.get("risk", "balanced").lower()
        if risk_profile not in ["conservative", "balanced", "aggressive"]:
            risk_profile = "balanced"

        # 1. Top Performers from Database (regardless of trend)
        top_gainers_objs = MarketStockSnapshot.objects.order_by('-day_change_pct')[:5]
        top_gainers = [{
            "symbol": obj.symbol,
            "name": obj.name,
            "change_pct": round(obj.day_change_pct, 2),
            "price": round(obj.market_price, 2)
        } for obj in top_gainers_objs]

        # 2. AI Picks (using LLM) with Risk Profiling and Price Targets
        # We give the LLM trending symbols and a risk persona
        trending_symbols = [obj.symbol for obj in top_gainers_objs]
        if not trending_symbols:
            trending_symbols = ["RELIANCE.NS", "TCS.NS", "INFY.NS", "NVDA", "AAPL"]
            
        ai_prompt = (
            f"Role: Professional Financial Advisor for QuantVista. User Risk Profile: {risk_profile.upper()}.\n"
            f"Based on these trending stocks: {', '.join(trending_symbols)}, "
            f"provide 5 top-quality stock recommendations suitable for a {risk_profile} investor. "
            "For each, provide: Symbol, a 1-sentence 'Why', 'EntryPrice', 'TargetPrice', and 'StopLoss'. "
            "Respond ONLY with a JSON list: [{\"symbol\": \"...\", \"why\": \"...\", \"entry\": \"...\", \"target\": \"...\", \"stop_loss\": \"...\", \"sector\": \"...\"}]"
        )
        
        ai_picks = []
        try:
            ai_res = ask_llm(ai_prompt)
            if "[" in ai_res and "]" in ai_res:
                json_str = ai_res[ai_res.find("["):ai_res.rfind("]")+1]
                ai_picks = json.loads(json_str)
            else:
                ai_picks = [{"symbol": trending_symbols[0], "why": f"Strong market momentum for {risk_profile} profile.", "entry": "Current", "target": "+15%", "stop_loss": "-5%", "sector": "Tech"}]
        except Exception:
            ai_picks = [{"symbol": "N/A", "why": "AI insights refreshing.", "entry": "N/A", "target": "N/A", "stop_loss": "N/A", "sector": "Other"}]

        # 3. Portfolio suggestions
        diversification = []
        if request.user and request.user.is_authenticated:
            user_holdings = Holding.objects.filter(portfolio__user=request.user).select_related('stock')
            if not user_holdings.exists():
                diversification.append("Start by adding a blue-chip stock like RELIANCE or NVDA to your first portfolio.")
            else:
                diversification.append("Your portfolio looks good! Consider adding an Index ETF for broader market exposure.")

        return Response({
            "top_gainers": top_gainers,
            "ai_picks": ai_picks,
            "diversification": diversification
        })
