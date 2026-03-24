from django.contrib import admin
from .models import StockMaster, StockPrice

@admin.register(StockMaster)
class StockMasterAdmin(admin.ModelAdmin):
    list_display = ("symbol", "name", "market")
    search_fields = ("symbol", "name")

@admin.register(StockPrice)
class StockPriceAdmin(admin.ModelAdmin):
    list_display = ("symbol", "price", "updated_at")
    list_filter = ("symbol", "updated_at")
