QUESTION_BANK = {
  "greeting": [
    "hi",
    "hii",
    "hello",
    "hey",
    "who are you",
    "what is this"
  ],
  "stock_basics": [
    "what is stock",
    "what is share",
    "define stock"
  ],
  "portfolio": [
    "what is portfolio",
    "portfolio meaning"
  ],
  "market": [
    "what is nse",
    "what is bse",
    "what is stock market"
  ],
  "investment": [
    "how to invest",
    "how to start investing"
  ],
  "my_portfolio": [
    "my stocks",
    "what do i own",
    "portfolio status",
    "analyze my portfolio",
    "my holdings"
  ],
  "recommendation": [
    "what should i buy",
    "suggest",
    "recommend",
    "top picks",
    "where to invest"
  ]
}

def detect_intent(user_message: str) -> str:
    message_lower = user_message.lower()
    for intent, keywords in QUESTION_BANK.items():
        for keyword in keywords:
            if keyword in message_lower:
                return intent
    return "general"

def generate_prompt_for_intent(intent: str, user_message: str) -> str:
    if intent == "greeting":
        return f"Act as QuantVista AI assistant. Provide a brief 2-3 line overview explaining that this website is an advanced stock portfolio optimization and AI forecasting platform. Keep it very concise. Respond to: {user_message}"
    elif intent == "stock_basics":
        return f"Explain in simple beginner-friendly terms (max 3 sentences): {user_message}"
    elif intent == "portfolio":
        return f"Explain portfolio concept with example (max 3 sentences): {user_message}"
    elif intent == "investment":
        return f"Give beginner-friendly investment guidance (max 3 sentences): {user_message}"
    elif intent == "my_portfolio":
        return f"You are analyzing the user's specific holdings. Provide a concise summary or analysis based on the context provided (max 3 sentences): {user_message}"
    elif intent == "recommendation":
        return f"Provde professional stock recommendations or suggestions based on market data or the user's existing portfolio diversification needs (max 3 sentences): {user_message}"
    else:  # general or market
        return f"Answer this finance-related question clearly and very briefly (max 3 sentences): {user_message}"
