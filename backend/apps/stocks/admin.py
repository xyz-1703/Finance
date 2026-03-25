from django.contrib import admin
from .models import StockMaster, StockPrice

@admin.register(StockMaster)
class StockMasterAdmin(admin.ModelAdmin):
    list_display = ("symbol", "name", "market")
    search_fields = ("symbol", "name")

@admin.register(StockPrice)
class StockPriceAdmin(admin.ModelAdmin):
    list_display = ("stock", "timestamp", "close", "volume")
    list_filter = ("stock", "timestamp")
    search_fields = ("stock__symbol", "stock__name")
