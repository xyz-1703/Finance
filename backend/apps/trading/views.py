from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Transaction
from .serializers import TradeRequestSerializer, TransactionSerializer
from .services import execute_trade


class TradeExecuteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TradeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            trade = execute_trade(user=request.user, **serializer.validated_data)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(TransactionSerializer(trade).data, status=status.HTTP_201_CREATED)


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).select_related("portfolio", "stock")
