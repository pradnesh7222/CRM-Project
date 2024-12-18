from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from app.serializers import LoginSerializer, RegistrationSerializer
from rest_framework import viewsets
from .models import   Communication, Course, Enrollment, Lead, Roles, Student, Users
from .serializers import  CommunicationSerializer, CourseSerializer, EnrollmentSerializer, LeadSerializer, RoleSerializer, StudentSerializer, UsersSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework import filters 
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

 

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
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

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    filter_backends = [filters.SearchFilter]  
    search_fields = ['first_name', 'last_name', 'email', 'status']


    def get_queryset(self):
        queryset = Lead.objects.all()
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        return queryset


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]  
    search_fields = ['first_name', 'last_name', 'email', 'enrollment_status']

class RolesViewSet(viewsets.ModelViewSet):
    queryset = Roles.objects.all()
    serializer_class = RoleSerializer

class CourseViewSet(viewsets.ModelViewSet):
    print("1")
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    print("2")
    #permission_classes = [RoleBasedPermission]
   

class conversion_rate(APIView):
    def get(self, request):
        print(request.user)
        leads = Lead.objects.count()
        students = Student.objects.count()
        conversion_rate = ( students/leads * 100) if students > 0 else 0

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



# views.py


# views.py
# views.py
# Ensure Lead is correctly imported

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



# In your views.py

# views.p


class LeadsPerStateView(APIView):
    def get(self, request):
        leads_count = Lead.objects.values('states').annotate(count=Count('id')).order_by('states')
        data = {entry['states']: entry['count'] for entry in leads_count}
        return Response(data, status=status.HTTP_200_OK)





from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class StudentsPerCourseView(APIView):
    def get(self, request):
        # Group enrollments by course and count each group
        course_counts = Enrollment.objects.values('course__name').annotate(count=Count('enrollment_id')).order_by('course__name')
        
        # Prepare the response data in dictionary format for visualization
        data = {entry['course__name']: entry['count'] for entry in course_counts}
        
        return Response(data, status=status.HTTP_200_OK)
