from django.contrib import admin
from .models import Portfolio, Holding, Transaction

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "created_at")
    search_fields = ("name", "user__email")

@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    list_display = ("portfolio", "stock", "quantity")
    list_filter = ("portfolio", "stock")

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("portfolio", "symbol", "action", "quantity", "price", "time")
    list_filter = ("action", "time")
