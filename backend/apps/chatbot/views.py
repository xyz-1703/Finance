from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .services import process_chat_message

class GeneralChatbotView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        message = request.data.get("message")
        if not message:
            return Response({"error": "Message is required"}, status=400)
        
        reply = process_chat_message(message, user=None)
        return Response({"reply": reply})

class PersonalizedChatbotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = request.data.get("message")
        if not message:
            return Response({"error": "Message is required"}, status=400)
        
        reply = process_chat_message(message, user=request.user)
        return Response({"reply": reply})
