from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.portfolio.models import Portfolio
from apps.trading.models import Transaction

from .permissions import IsStaffUser


class AdminHealthView(APIView):
    permission_classes = [IsStaffUser]

    def get(self, request):
        return Response(
            {
                "status": "ok",
                "users": User.objects.count(),
                "portfolios": Portfolio.objects.count(),
                "transactions": Transaction.objects.count(),
            }
        )
