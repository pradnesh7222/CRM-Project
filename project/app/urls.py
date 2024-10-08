"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from app.views import  CustomerViewSet, LeadViewSet, OpportunityViewSet, ProductViewSet, RegistrationView,Login
router = DefaultRouter()
router.register(r'leads', LeadViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'products', ProductViewSet)
router.register(r'opportunities', OpportunityViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('register/',RegistrationView.as_view()),
    path('login/',Login.as_view()),
    #path('customers/', CustomerListCreate.as_view(), name='customer-list-create'),
    #path('leads/', LeadListCreate.as_view(), name='lead-list-create'),
]
