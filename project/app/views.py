from django.shortcuts import render
import django_filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from app.serializers import LoginSerializer, RegistrationSerializer
from rest_framework import viewsets
from .models import   Course, Lead, Roles, Student, Users
from .serializers import  CourseSerializer, LeadSerializer, RoleSerializer, StudentSerializer, UsersSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework import filters 
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics, permissions
from django.contrib.auth import logout
from django_filters.rest_framework import DjangoFilterBackend
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
    #permission_classes = [IsAuthenticated]  

    def post(self, request):
        logout(request)  
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)   

class UsersViewSet(viewsets.ReadOnlyModelViewSet):  
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
class LeadFilter(django_filters.FilterSet):
    # Filter based on the `status` field in the Lead model
    status = django_filters.ChoiceFilter(choices=[
        ('Enquiry', 'Enquiry'),
        ('Follow Up', 'Follow Up'),
        ('Application', 'Application')
    ])

    class Meta:
        model = Lead
        fields = ['status'] 
        
class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = LeadFilter  

    def get_queryset(self):
        # You can customize the queryset if needed
        return super().get_queryset()

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]  
    search_fields = ['first_name', 'last_name', 'email', 'enrollment_status']

class RolesViewSet(viewsets.ModelViewSet):
    queryset = Roles.objects.all()
    serializer_class = RoleSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class conversion_rate(APIView):
    def get(self, request):
        leads = Lead.objects.count()
        students = Student.objects.count()

        # Avoid division by zero
        conversion_rate = ( leads/students * 100) if students > 0 else 0

        active_students_count = Student.objects.filter(enrollment_status='active').count()
        graduated_students_count = Student.objects.filter(enrollment_status='Graduated').count()
        
        # Return all the data as a single dictionary
        return Response({
            'conversionRate': conversion_rate,
            'totalLeads': leads,
            'activeStudents': active_students_count,
            'graduatedStudents': graduated_students_count,
        })
    
class Convert_lead_to_student(APIView):
    def post(self, request):
        lead_id = request.data['lead_id']
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
