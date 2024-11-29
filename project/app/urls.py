from app import views
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    ActiveStudents, AssignLeadView, ChangePasswordView, CommunicationHistoryViewSet, CommunicationViewSet, ContactCreateView, Convert_lead_to_student,
    CourseIdView, CourseViewSet, EmailSendViewSet, EnquiryLeadsList, EnquiryTelecallerViewSet, EnrollStudentView,
    EnrollmentViewSet, InstallmentViewSet, LeadsSourceViewSet, LogoutView, PlacedStudents, RemarkViewSet, RemarkWorkshopLeadViewSet, RemarksViewSet, SendSMSView, TelecallerPageView, UserLoginView,
    UserRegistrationView, WorkshopLeadViewSet, WorkshopLeadsList, WorkshopTelecallerPageView, WorkshopTelecallerViewSet, conversion_rate,
    UsersViewSet, LeadViewSet, StudentViewSet, RolesViewSet, monthly_leads_count,
    LeadsPerStateView, StudentsPerCourseView, MonthlyActiveStudentsView,create_enquiry_telecaller,get_leads_by_telecaller
)
from django.conf import settings
from django.conf.urls.static import static
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
router = DefaultRouter()
router.register(r'users', UsersViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'students', StudentViewSet)
router.register(r'roles', RolesViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'communications', CommunicationViewSet)
router.register(r'CommunicationHistory', CommunicationHistoryViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'WorkshopLeads', WorkshopLeadViewSet)
router.register(r'Installments', InstallmentViewSet)
router.register(r'EnquiryTelecaller', EnquiryTelecallerViewSet)
router.register(r'WorkshopTelecaller', WorkshopTelecallerViewSet, basename='workshoptelecaller_unique')
router.register(r'remarks', RemarkViewSet, basename='remarks')  # First instance
router.register(r'remarks-detail', RemarksViewSet, basename='remarks-detail')  # Rename this
router.register(r'RemarkWorkshopLeadViewSet', RemarkWorkshopLeadViewSet,basename='remark')
router.register(r'LeadsSource', LeadsSourceViewSet)
schema_view = get_schema_view(
   openapi.Info(
      title="Snippets API",
      default_version='v1',
      description="Test description",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)
urlpatterns = [
    path('UserRegister/', UserRegistrationView.as_view(), name='UserRegister'),
    path('UserLogin/', UserLoginView.as_view(), name='UserLogin'),
    path('UserLogout/', LogoutView.as_view(), name='UserLogout'),
    path('PercentageOfConversionofLeadToStudents /', conversion_rate.as_view(), name='PercentageOfConversionofLeadToStudents'),
    path('ConversionofLeadToStudents/', Convert_lead_to_student.as_view(), name='Convert_lead_to_student'),
    path('api/Home/Graph/NumberOfLeadsInAMonth/', monthly_leads_count, name='monthly_leads_count'),
    path('api/Home/Graph/NumberOfLeadsInAState/', LeadsPerStateView.as_view(), name='leads-per-state'),
    path('api/Home/Graph/PieChart/StudentsCountInEachCourse/', StudentsPerCourseView.as_view(), name='students-per-course'),
    path('api/ActiveStudentsPerMonth/', MonthlyActiveStudentsView.as_view(), name='monthly_active_students'),
    path('api/StudentsEnrollmentHistory/', EnrollStudentView.as_view(), name='enroll-student'),
    path('api/Home/Card/StudentsStatusActive/', ActiveStudents.as_view(), name='ActiveStudents'),
    path('api/Home/Card/StudentsStatusGraduatedStudents/', PlacedStudents.as_view(), name='PlacedStudents'),
    path('api/Communication/EmailSend/', EmailSendViewSet.as_view(), name='EmailSendViewSet'),
    path('api/FetchCourseId/', CourseIdView.as_view(), name='get-course-id'),
    path('assign-lead/', AssignLeadView.as_view(), name='assign-lead'),
    path('create/NewTelecaller/', create_enquiry_telecaller.as_view(), name='create_enquiry_telecaller'),
    path('Get/EnquiryLeadsOnTelecaller/', views.get_leads_by_telecaller, name='get_leads_by_telecaller'),
    path('Get/WorkshopleadsOnTelecaller/', views.get_workshopleads_by_telecaller, name='get_workshopleads_by_telecaller'),
    path('Get/UnassignedEnquiryTelecaller/', views.get_unassigned_enquiry_telecaller, name='get_unassigned_enquiry_telecaller'),
    path('Get/UnassignedWorkshopTelecaller/', views.get_unassigned_workshop_telecaller, name='get_leads_by_telecaller'),
    path('get_leads_by_telecaller/', views.get_assigned_workshop_telecaller, name='get_leads_by_telecaller'),
    path('get_unassigned_enquiry_telecaller/', views.get_assigned_enquiry_telecaller, name='get_unassigned_enquiry_telecaller'),
     #path('send_sms/', SendSMSView.as_view(), name='send_sms'),
     path('api/User/ChangePassword/', ChangePasswordView.as_view(), name='change_password'),
     path('Get/AssignedEnquiryTelecaller/', TelecallerPageView.as_view(), name='TelecallerPageView'),
      path('Get/AssignedWorkshopTelecaller/', WorkshopTelecallerPageView.as_view(), name='TelecallerPageView'),
       path('api/EnquiryLeads/DownloadExcel/', views.download_excel, name='download_excel'),
       path('api/leads/', EnquiryLeadsList.as_view(), name='enquiry-leads-list'),
       path('api/workshopleadsAdminpage/<int:id>/', WorkshopLeadsList.as_view(), name='enquiry-leads-list'),
        path('api/WorkshopLeads/DownloadExcel/', views.download_excel_workshop, name='download_excel_workshop'),
        path('contacts/', ContactCreateView.as_view(), name='create_contact'),
        path('Get/UserRole/', views.get_user_role, name='get_user_role'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]

urlpatterns += router.urls

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
