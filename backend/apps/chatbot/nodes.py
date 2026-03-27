from typing import Dict, Any
from .intents import detect_intent, generate_prompt_for_intent
from .services import ask_llm
from apps.portfolio.models import Portfolio, Holding

def detect_intent_node(state: Dict[str, Any]) -> Dict[str, Any]:
    user_message = state.get("user_message", "")
    intent = detect_intent(user_message)
    return {"intent": intent}

def context_builder_node(state: Dict[str, Any]) -> Dict[str, Any]:
    user_message = state.get("user_message", "")
    user = state.get("user")
    
    portfolios = Portfolio.objects.filter(user=user)
    portfolio_info = []
    
    for index, p in enumerate(portfolios):
        holdings = Holding.objects.filter(portfolio=p)
        holding_details = [f"{h.stock.symbol} (Qty: {h.quantity})" for h in holdings]
        portfolio_info.append(f"Portfolio {index+1} ({p.name}): {', '.join(holding_details)}")

    predictions_text = "N/A"
    try:
        from apps.mlops.models import PredictionRun
        stock_ids = [h.stock.id for p in portfolios for h in Holding.objects.filter(portfolio=p)]
        recent_preds = PredictionRun.objects.filter(stock__id__in=stock_ids).order_by('stock', '-created_at').distinct('stock')
        pred_details = [f"{p.stock.symbol}: {p.prediction} ({p.model_type})" for p in recent_preds]
        if pred_details:
            predictions_text = "; ".join(pred_details)
    except Exception:
        pass
    
    sentiment_text = "N/A"
    portfolio_text = '; '.join(portfolio_info) if portfolio_info else 'None'
    
    # NEW: Fetch Top Gainers for Market Context
    from apps.insights.models import MarketStockSnapshot
    top_stocks = MarketStockSnapshot.objects.order_by('-day_change_pct')[:5]
    market_context = ", ".join([f"{s.symbol} (+{round(s.day_change_pct, 2)}%)" for s in top_stocks])

    context_prompt = (
        f"You are a sophisticated AI financial advisor.\n"
        f"Context regarding the user's account:\n"
        f"- User Portfolio: {portfolio_text}\n"
        f"- Predictions: {predictions_text}\n"
        f"- Market Context (Top Performers): {market_context}\n"
        f"- Sentiment: {sentiment_text}\n\n"
        f"User Question: {user_message}\n\n"
        f"IMPORTANT: Use the exact holdings and market data above. If the user asks for recommendations, "
        f"suggest stocks that complement their portfolio or point to the top performers listed. "
        f"Keep your response under 3 sentences."
    )
    
    return {"prompt": context_prompt, "context": portfolio_text}

def llm_node(state: Dict[str, Any]) -> Dict[str, Any]:
    intent = state.get("intent", "general")
    
    if intent == "greeting":
        return {
            "bot_reply": "Welcome to QuantVista! We are an advanced stock portfolio optimization and AI forecasting platform designed to intelligently manage your financial assets. How can I assist you today?"
        }

    prompt = state.get("prompt")
    if not prompt:
        user_message = state.get("user_message", "")
        prompt = generate_prompt_for_intent(intent, user_message)
        
    reply = ask_llm(prompt)
    return {"bot_reply": reply}
