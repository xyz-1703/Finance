from django.contrib import admin
<<<<<<< HEAD
from .models import StockMaster, StockPrice

@admin.register(StockMaster)
class StockMasterAdmin(admin.ModelAdmin):
    list_display = ("symbol", "name", "market")
    search_fields = ("symbol", "name")

@admin.register(StockPrice)
class StockPriceAdmin(admin.ModelAdmin):
    list_display = ("symbol", "price", "updated_at")
    list_filter = ("symbol", "updated_at")
=======

from .models import Fundamental, Price, Stock

admin.site.register(Stock)
admin.site.register(Price)
admin.site.register(Fundamental)
>>>>>>> f676874015cfdcfa865c247090c40e9cf22a2aba
