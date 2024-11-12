from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from app.serializers import LoginSerializer, RegistrationSerializer
from rest_framework import viewsets
from .models import   Communication, CommunicationHistory, Course, Enquiry_Leads, EnquiryTelecaller, Enrollment, Installment, LeadAssignment,  Roles, Student, Users, Workshop_Leads, WorkshopTelecaller
from .serializers import  CommunicationHistorySerializer, CommunicationSerializer, CourseSerializer, EnquiryTelecallerSerializer, EnrollmentSerializer, InstallmentSerializer, LeadAssignmentSerializer, LeadSerializer, RoleSerializer, StudentSerializer, UsersSerializer, WorkshopSerializer, WorkshopTelecallerSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from rest_framework import filters 
from django.contrib.auth.models import User
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics, permissions
from django.contrib.auth import logout
from .permissions import RoleBasedPermission
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.http import JsonResponse
from django.db.models import Count
from django.db.models.functions import TruncMonth
from rest_framework import status
from django.db.models import Count
from django.db.models.functions import TruncMonth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Student
from rest_framework import serializers
from calendar import month_name
from datetime import timedelta
from app.tasks import send_scheduled_email
from django.db.models import Count
from rest_framework.views import APIView
import json
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
class UserRegistrationView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            tokens = serializer.get_tokens_for_user()
            return Response(tokens, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        print(request.user)
        logout(request)  
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)   

class UsersViewSet(viewsets.ReadOnlyModelViewSet):  
    queryset = Users.objects.all()
    serializer_class = UsersSerializer

class WorkshopLeadViewSet(viewsets.ModelViewSet):
    queryset =Workshop_Leads.objects.filter(is_deleted=False) 
    serializer_class = WorkshopSerializer

    def destroy(self, request, *args, **kwargs):  
        lead = self.get_object()  
        lead.is_deleted = True 
        lead.save() 
        return Response(status=status.HTTP_200_OK)  

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Enquiry_Leads.objects.filter(is_deleted=False) 
    serializer_class = LeadSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'course', 'email']
    ordering_fields = ['name', 'email', 'course']

    def get_queryset(self):
        queryset = Enquiry_Leads.objects.filter(is_deleted=False)
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset

    def destroy(self, request, *args, **kwargs):  # Change 'args' to '*args'
        lead = self.get_object()  # Retrieve the lead object
        lead.is_deleted = True  # Mark as deleted
        lead.save()  # Save the changes
        return Response(status=status.HTTP_200_OK)  # Return success status

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.filter(deleted=False)
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'enrollment_status']
    ordering_fields = ['first_name','last_name', 'email', 'created_at']
    def destroy(self, request, *args, **kwargs):
        student = self.get_object()
        student.deleted = True
        student.save()
        return Response( status=status.HTTP_200_OK)

class RolesViewSet(viewsets.ModelViewSet):
    queryset = Roles.objects.all()
    serializer_class = RoleSerializer

class InstallmentViewSet(viewsets.ModelViewSet):
    queryset = Installment.objects.all()
    serializer_class = InstallmentSerializer

class CourseViewSet(viewsets.ModelViewSet):
    #print("1")
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    #print("2")
    #permission_classes = [RoleBasedPermission]
   

class conversion_rate(APIView):
    def get(self, request):
        print(request.user)
        leads = Lead.objects.count()
        students = Student.objects.count()
        conversion_rate = round(( students/leads  * 100), 2) if students > 0 else 0


        active_students_count = Student.objects.filter(enrollment_status='active').count()
        graduated_students_count = Student.objects.filter(enrollment_status='Graduated').count()
        total_students_active_till_date=Student.objects.count()
        return Response({
            'conversionRate': conversion_rate,
            'totalLeads': leads,
            'activeStudents': active_students_count,
            'graduatedStudents': graduated_students_count,
            'total_students_active_till_date':total_students_active_till_date
        })
    
class Convert_lead_to_student(APIView):
    def post(self, request):
        lead_id = request.data['id']
        lead = Lead.objects.get(id=lead_id)
        user_id = request.data['assigned_to_user']
        user_instance = Users.objects.get(id=user_id)
        student = Student.objects.create(
            first_name=request.data['first_name'],
            last_name=request.data['last_name'],
            email=request.data['email'],
            enrollment_status='active',
            phone_number=request.data['phone_number'],
            user=user_instance,
            date_of_birth="2001-06-04",
            lead_id=lead,
            address=request.data['address'],
            states=request.data['states']
            )
        student.save()
        lead.status="Application"
        lead.save()
        return Response({"message": "lead has been converted to student"}, status=status.HTTP_200_OK)   

class CommunicationViewSet(viewsets.ModelViewSet):
    queryset = Communication.objects.all()
    serializer_class = CommunicationSerializer

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

class CommunicationHistoryViewSet(viewsets.ModelViewSet):
    queryset = CommunicationHistory.objects.all()
    serializer_class = CommunicationHistorySerializer



def monthly_leads_count(request):
    monthly_data = (
        Lead.objects.annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(count=Count("id"))
        .order_by("month")
    )
    response_data = {
        "labels": [data["month"].strftime("%B") for data in monthly_data],
        "counts": [data["count"] for data in monthly_data],
    }
    return JsonResponse(response_data)



class LeadsPerStateView(APIView):
    def get(self, request):
        leads_count = Lead.objects.values('states').annotate(count=Count('id')).order_by('states')
        data = {entry['states']: entry['count'] for entry in leads_count}
        return Response(data, status=status.HTTP_200_OK)


class StudentsPerCourseView(APIView):
    def get(self, request):
        # Group enrollments by course and count each group
        course_counts = Enrollment.objects.values('course__name').annotate(count=Count('enrollment_id')).order_by('course__name')
        
        # Prepare the response data in dictionary format for visualization
        data = {entry['course__name']: entry['count'] for entry in course_counts}
        
        return Response(data, status=status.HTTP_200_OK)
    
class MonthlyActiveStudentsView(APIView):
    def get(self, request):
        monthly_data = (
            Student.objects.filter(enrollment_status='active')
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )

        # Create a full list of months with zero counts
        counts_dict = {i: 0 for i in range(1, 13)}  # Months 1-12

        for data in monthly_data:
            month_index = data["month"].month  # Get the month number
            counts_dict[month_index] = data["count"]

        response_data = {
            "labels": [month_name[i] for i in range(1, 13)],  # Month names
            "counts": [counts_dict[i] for i in range(1, 13)],  # Counts for all months
        }

        return Response(response_data, status=status.HTTP_200_OK)


class EnrollStudentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get course ID and student ID from request data
        print("Request Data:", request.data)

        course_id = request.data.get('course')
        student_id = request.data.get('student')

    # Ensure the course exists
        course = get_object_or_404(Course, id=course_id)

    # Debugging statements
        print("Logged-in User:", request.user)
        print("Requested Student ID:", student_id)

    # Check for Students associated with the logged-in User
        associated_students = Student.objects.filter(user=request.user)
        print("Associated Students:", list(associated_students))
        student = get_object_or_404(Student, id=student_id)
        print(student)
        # Create the enrollment
        enrollment = Enrollment.objects.create(
            student=student,
            course=course,
            status='enrolled',  # Automatically set the status to 'enrolled'
        )

        # Return a success response
        return Response({
            'enrollment_id': enrollment.enrollment_id,
            'student': str(enrollment.student),
            'course': str(enrollment.course),
            'status': enrollment.status,
            'enrollment_date': enrollment.enrollment_date
        }, status=status.HTTP_201_CREATED)
    
class ActiveStudents(APIView):
    def get(self, request):
        students = Student.objects.filter(enrollment_status="Active")
        serializer = StudentSerializer(students, many=True)
        return Response({"students": serializer.data}, status=status.HTTP_200_OK)

class PlacedStudents(APIView):
    def get(self, request):
        students = Student.objects.filter(enrollment_status="Graduated")
        serializer = StudentSerializer(students, many=True)
        return Response({"students": serializer.data}, status=status.HTTP_200_OK)
@shared_task
def send_scheduled_email(subject, message, recipient_list):
    #print("This is send sheduled mail")
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        recipient_list,
    )  
class EmailSendViewSet(APIView):
    
    def post(self, request):
        # Extract email details from the request data if needed
        print(request.data)
        subject = "Scheduled Email"
        message = request.data.get("message")
        recipient_list = request.data.get("recipient_list")
        print(1)
        send_scheduled_email.apply_async(
            args=[subject, message, recipient_list],
            countdown=60 # 600 seconds = 10 minutes
        )

        print("Email task scheduled.")
        return Response({"detail": "Email scheduled successfully."}, status=status.HTTP_201_CREATED)

class CourseIdView(APIView):
    def post(self, request, *args, **kwargs):
        # Get the course name from the query parameter
        course_name = request.data.get('courseName', None)

        if not course_name:
            return Response({"error": "Course name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find the course with the given name
            course = Course.objects.get(name=course_name)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Return the course id
        return Response({"courseId": course.id}, status=status.HTTP_200_OK)

class WorkshopTelecallerViewSet(viewsets.ModelViewSet):
    queryset = WorkshopTelecaller.objects.all()
    serializer_class = WorkshopTelecallerSerializer

class EnquiryTelecallerViewSet(viewsets.ModelViewSet):
    queryset = EnquiryTelecaller.objects.all()
    serializer_class = EnquiryTelecallerSerializer

class create_enquiry_telecaller(APIView):

    def post(self, request, *args, **kwargs):
        data = request.data
        try:
            # Ensure the user is authenticated and assign it to the telecaller
            if request.user.is_authenticated:
                user = request.user
            else:
                return Response({"error": "User must be logged in"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Proceed with creating the telecaller instance
            EnquiryTelecaller.objects.create(
                user=user,
                name=data.get("name"),
                email=data.get("email"),
                phone_number=data.get("phone_number"),
                location=data.get("location"),
            )
            return Response({"message": "Telecaller created successfully!"}, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AssignLeadView(APIView):
    def post(self, request):
        serializer = LeadAssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['POST'])
def get_leads_by_telecaller(request):
    telecaller_name = request.data.get('telecaller')
    lead_count = int(request.data.get('numberOfLeads', 0))
    sample_leads=request.data.get('leads')
    print(sample_leads)
    print(lead_count)
    telecaller = EnquiryTelecaller.objects.filter(name=telecaller_name).first()
    print(telecaller)
    if not telecaller:
        return Response({"error": "Telecaller not found"}, status=status.HTTP_404_NOT_FOUND)

    leads = Enquiry_Leads.objects.all()[:lead_count]
    print(leads) 
    i=0       
    for lead in leads:
        print(i+1)
        telecaller.assigned_lead.add(lead)
        telecaller.save()
        lead.assigned = True  
        lead.save()
    
    serialized_leads = LeadSerializer(leads, many=True).data
    return Response(serialized_leads, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unassigned_enquiry_telecaller(request):
    leads = Enquiry_Leads.objects.filter(assigned__isnull=True)
    serialized_leads = LeadSerializer(leads, many=True).data
    return Response(serialized_leads, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unassigned_workshop_telecaller(request):
    leads = Workshop_Leads.objects.filter(assigned__isnull=True)
    serialized_leads = WorkshopSerializer(leads, many=True).data
    return Response(serialized_leads, status=status.HTTP_200_OK)