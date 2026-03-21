from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ClusterResultViewSet, ClusterRunView, PredictionRunView, PredictionRunViewSet

router = DefaultRouter()
router.register(r"clusters", ClusterResultViewSet, basename="clusters")
router.register(r"predictions", PredictionRunViewSet, basename="predictions")

urlpatterns = [
    path("cluster/run/", ClusterRunView.as_view(), name="cluster-run"),
    path("prediction/run/", PredictionRunView.as_view(), name="prediction-run"),
    *router.urls,
]
