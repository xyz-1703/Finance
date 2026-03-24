from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PredictionRun, StockCluster
from .serializers import (
    ClusterRequestSerializer,
<<<<<<< HEAD
=======
    PortfolioClusterRequestSerializer,
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    PredictionRequestSerializer,
    PredictionRunSerializer,
    StockClusterSerializer,
)
<<<<<<< HEAD
from .services import run_portfolio_clustering, run_prediction
=======
from .services import run_portfolio_clustering, run_portfolio_clustering_for_portfolio, run_prediction
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba


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


<<<<<<< HEAD
=======
class PortfolioClusterRunView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PortfolioClusterRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            clusters = run_portfolio_clustering_for_portfolio(
                created_by=request.user,
                portfolio_id=serializer.validated_data["portfolio_id"],
                n_clusters=serializer.validated_data["n_clusters"],
            )
        except ValueError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(StockClusterSerializer(clusters, many=True).data)


>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
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
<<<<<<< HEAD
    filterset_fields = ["stock", "cluster_label"]
=======
    filterset_fields = ["stock", "cluster_label", "portfolio"]
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba


class PredictionRunViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PredictionRun.objects.select_related("stock").all()
    serializer_class = PredictionRunSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ["stock", "model_type"]
