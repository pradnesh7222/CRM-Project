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
from django.contrib.auth import views as auth_views
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from app.views import  CustomerViewSet, LeadViewSet, OpportunityViewSet,  PasswordResetRequestView, ProductViewSet, RegistrationView,Login
router = DefaultRouter()
router.register(r'leads', LeadViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'products', ProductViewSet)
router.register(r'opportunities', OpportunityViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path('register/',RegistrationView.as_view()),
    path('login/',Login.as_view()),
     path('password-reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_api'),
]




