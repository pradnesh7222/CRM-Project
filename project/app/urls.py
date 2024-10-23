from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import  Convert_lead_to_student, CourseViewSet, LogoutView, UserLoginView, UserRegistrationView, conversion_rate
from .views import UsersViewSet, LeadViewSet, StudentViewSet, RolesViewSet


router = DefaultRouter()
router.register(r'users', UsersViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'students', StudentViewSet)
router.register(r'roles', RolesViewSet)
router.register(r'courses', CourseViewSet)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('conversion_rate/', conversion_rate.as_view(), name='conversion_rate'),
    path('Convert_lead_to_student/',Convert_lead_to_student.as_view(), name='Convert_lead_to_student'),
    
]


urlpatterns += router.urls
