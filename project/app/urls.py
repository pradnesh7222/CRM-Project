from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import  ActiveStudents, CommunicationHistoryViewSet, CommunicationViewSet, Convert_lead_to_student, CourseViewSet, EmailSendViewSet, EnrollStudentView, EnrollmentViewSet,LogoutView, PlacedStudents, UserLoginView, UserRegistrationView, conversion_rate
from .views import UsersViewSet, LeadViewSet, StudentViewSet, RolesViewSet
from .views import monthly_leads_count
from .views import LeadsPerStateView,StudentsPerCourseView,MonthlyActiveStudentsView
from django.conf import settings
from django.conf.urls.static import static



router = DefaultRouter()
router.register(r'users', UsersViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'students', StudentViewSet)
router.register(r'roles', RolesViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'communications', CommunicationViewSet)
router.register(r'CommunicationHistory', CommunicationHistoryViewSet)
router.register(r'enrollments', EnrollmentViewSet)


urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('conversion_rate/', conversion_rate.as_view(), name='conversion_rate'),
    path('Convert_lead_to_student/',Convert_lead_to_student.as_view(), name='Convert_lead_to_student'),
    path('api/monthly-leads/', monthly_leads_count, name='monthly_leads_count'),
    path('api/leads-per-state/', LeadsPerStateView.as_view(), name='leads-per-state'),
    path('api/students-per-course/', StudentsPerCourseView.as_view(), name='students-per-course'),
    path('api/active-students-per-month/', MonthlyActiveStudentsView.as_view(), name='monthly_active_students'),
    path('enroll/', EnrollStudentView.as_view(), name='enroll-student'),
    path('ActiveStudents/', ActiveStudents.as_view(), name='ActiveStudents'),
    path('GraduatedStudents/', PlacedStudents.as_view(), name='PlacedStudents'),
    path('EmailSendViewSet/', EmailSendViewSet.as_view(), name='EmailSendViewSet'),
]



urlpatterns += router.urls
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)