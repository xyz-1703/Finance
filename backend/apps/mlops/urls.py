from django.urls import path
from rest_framework.routers import DefaultRouter

<<<<<<< HEAD
from .views import ClusterResultViewSet, ClusterRunView, PredictionRunView, PredictionRunViewSet
=======
from .views import ClusterResultViewSet, ClusterRunView, PortfolioClusterRunView, PredictionRunView, PredictionRunViewSet
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba

router = DefaultRouter()
router.register(r"clusters", ClusterResultViewSet, basename="clusters")
router.register(r"predictions", PredictionRunViewSet, basename="predictions")

urlpatterns = [
    path("cluster/run/", ClusterRunView.as_view(), name="cluster-run"),
<<<<<<< HEAD
=======
    path("portfolio/cluster/run/", PortfolioClusterRunView.as_view(), name="portfolio-cluster-run"),
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
    path("prediction/run/", PredictionRunView.as_view(), name="prediction-run"),
    *router.urls,
]
