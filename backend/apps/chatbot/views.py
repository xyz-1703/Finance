from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .services import ask_llm
from .models import ChatMessage

class ChatAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user and request.user.is_authenticated:
            # Fetch recent 50 messages to prevent overload
            messages = ChatMessage.objects.filter(user=request.user).order_by('created_at')[:50]
            data = [{"sender": m.sender, "text": m.text} for m in messages]
            return Response(data)
        return Response([])

    def post(self, request):
        user_message = request.data.get("message", "").strip()
        if not user_message:
            return Response({"reply": "Please provide a valid message."})
        
        is_auth = request.user and request.user.is_authenticated
        
        # Save user message if authenticated
        if is_auth:
            ChatMessage.objects.create(user=request.user, sender="user", text=user_message)

        # Execute LangGraph
        from .graph import chatbot_graph
        initial_state = {
            "user_message": user_message,
            "is_authenticated": is_auth,
            "user": request.user if is_auth else None
        }
        
        try:
            final_state = chatbot_graph.invoke(initial_state)
            ai_reply = final_state.get("bot_reply", "Sorry, I could not generate a response.")
        except Exception as e:
            print(f"LangGraph execution error: {str(e)}")
            ai_reply = "An error occurred during AI processing."
        
        # Save bot message if authenticated
        if is_auth:
            ChatMessage.objects.create(user=request.user, sender="bot", text=ai_reply)
        
        return Response({"reply": ai_reply})
