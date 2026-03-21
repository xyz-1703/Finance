from django.contrib import admin

from .models import PredictionRun, StockCluster

admin.site.register(StockCluster)
admin.site.register(PredictionRun)
