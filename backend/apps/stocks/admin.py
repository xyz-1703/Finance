from django.contrib import admin

from .models import Fundamental, Price, Stock

admin.site.register(Stock)
admin.site.register(Price)
admin.site.register(Fundamental)
