from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PredictionRun, StockCluster
from .serializers import (
    ClusterRequestSerializer,
    PredictionRequestSerializer,
    PredictionRunSerializer,
    StockClusterSerializer,
)
from .services import run_portfolio_clustering, run_prediction


class ClusterRunView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ClusterRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            clusters = run_portfolio_clustering(created_by=request.user, **serializer.validated_data)
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(StockClusterSerializer(clusters, many=True).data)


class PredictionRunView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PredictionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            prediction = run_prediction(created_by=request.user, **serializer.validated_data)
        except (ValueError, Exception) as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(PredictionRunSerializer(prediction).data)


class ClusterResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StockCluster.objects.select_related("stock").all()
    serializer_class = StockClusterSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["stock", "cluster_label"]


class PredictionRunViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PredictionRun.objects.select_related("stock").all()
    serializer_class = PredictionRunSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["stock", "model_type"]
