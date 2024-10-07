from django.contrib import admin

from app.models import Customer, Lead

# Register your models here.
admin.site.register(Lead)
admin.site.register(Customer)
