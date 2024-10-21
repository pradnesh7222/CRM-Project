from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import Active_students, CourseViewSet, LogoutView, Placed_students, Total_leads, UserLoginView, UserRegistrationView, conversion_rate
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
    path('Active_students/', Active_students.as_view(), name='Active_students'),
    path('Placed_students/', Placed_students.as_view(), name='Placed_students'),
    path('Total_leads/', Total_leads.as_view(), name='Total_leads'),
]


urlpatterns += router.urls
