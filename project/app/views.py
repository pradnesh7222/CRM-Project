from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from rest_framework import generics
from app.serializers import LoginSerializer, RegistrationSerializer
from rest_framework import viewsets
from .models import   Communication, CommunicationHistory, Course, Enquiry_Leads, EnquiryTelecaller, Enrollment, Installment, LeadAssignment, LeadSource, Remarks,  Roles, Student, Users, Workshop_Leads, WorkshopTelecaller
from .serializers import  ChangePasswordSerializer, CommunicationHistorySerializer, CommunicationSerializer, ContactSerializer, CourseSerializer, EnquiryLeadsSerializer, EnquiryTelecallerSerializer, EnrollmentSerializer, InstallmentSerializer, LeadAssignmentSerializer, LeadSerializer, LeadSourceserializer, RemarkSerializer, RemarksSerializer, RoleSerializer, StudentSerializer, UsersSerializer, WorkshopLeadSerializer, WorkshopSerializer, WorkshopTelecallerSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from rest_framework import filters 
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime
import pandas as pd
from django.http import HttpResponse
import io
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
    def post(self,request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_instance=Users.objects.get(id=1)
            # Check if the user is the first user
            #print(User.objects.count())
            if User.objects.count() >= 1:
                # Add default courses for the first user
                default_courses = [
                    {"name": "Business Analyst", "description": "Business Analyst", "price": "100000.00", "Instructor": user_instance},
                    {"name": "Fullstack / Python", "description": "Fullstack / Python", "price": "100000.00", "Instructor": user_instance},
                    {"name": "Mobile App", "description": "Mobile App", "price": "100000.00", "Instructor": user_instance},
                    {"name": "MERN && MEAN", "description": "MERN && MEAN", "price": "100000.00", "Instructor": user_instance},
                    {"name": "nodejs-fullstack-mean-mern-course", "description": "nodejs-fullstack-mean-mern-course", "price": "100000.00", "Instructor": user_instance},
                ]
                #print(default_courses)
                for course in default_courses:
                    Course.objects.create(**course)
                #course=Course.objects.all()
                print(course)
            return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)
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
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            # Check if the old password is correct
            if not user.check_password(old_password):
                return Response({"error": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

            # Set the new password
            user.set_password(new_password)
            user.save()
            return Response({"success": "Password changed successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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

    def destroy(self, request, *args, **kwargs):  
        lead = self.get_object() 
        lead.is_deleted = True  
        lead.save()
        return Response(status=status.HTTP_200_OK) 

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

@permission_classes([IsAuthenticated])
class CourseViewSet(viewsets.ModelViewSet):
    #print("1")
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    #print("2")
    #permission_classes = [RoleBasedPermission]
   

class conversion_rate(APIView):
    def get(self, request):
        print(request.user)
        leads = Enquiry_Leads.objects.count()
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
        lead = Enquiry_Leads.objects.get(id=lead_id)
        user_id = request.data['assigned_to_user']
        print(user_id)
        user_instance = User.objects.get(id=user_id)
        print(user_instance)
        course_id=request.data['course']
        course_instance=Course.objects.get(id=course_id)
        student = Student.objects.create(
            first_name=request.data['name'],
            last_name='null',
            email=request.data['email'],
            enrollment_status='active',
            phone_number=request.data['phone_number'],
            user=user_instance,
            date_of_birth="2001-06-04",
            lead_id=lead,
            address='null',
            courses=course_instance
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
class LeadsSourceViewSet(viewsets.ModelViewSet):
    queryset = LeadSource.objects.all()
    serializer_class = LeadSourceserializer

@permission_classes([IsAuthenticated])
def monthly_leads_count(request):
    monthly_data = (
        Enquiry_Leads.objects.annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(count=Count("id"))
        .order_by("month")
    )
    
    response_data = {
        "labels": [data["month"].strftime("%B") for data in monthly_data],
        "counts": [data["count"] for data in monthly_data],
    }
    return JsonResponse(response_data)



CITY_TO_STATE = {
    "Mumbai": "Maharashtra",
    "Bengaluru": "Karnataka",
}
@permission_classes([IsAuthenticated])
class LeadsPerStateView(APIView):
    def get(self, request):
        leads_count = Workshop_Leads.objects.values('location').annotate(count=Count('id')).order_by('location')
        print(leads_count)
        data = {}

        for entry in leads_count:
            city = entry['location']
            print(city)
            count = entry['count']
            state = CITY_TO_STATE.get(city, city)

            data[state] = data.get(state, 0) + count
            print(data)
        response_data = {"India": data}

        return Response(response_data, status=status.HTTP_200_OK)

@permission_classes([IsAuthenticated])
class StudentsPerCourseView(APIView):
    def get(self, request):
        # Group enrollments by course and count each group
        course_counts = Enquiry_Leads.objects.values('course__name').annotate(count=Count('id')).order_by('course__name')
        
        # Prepare the response data in dictionary format for visualization
        data = {entry['course__name']: entry['count'] for entry in course_counts}
        
        return Response(data, status=status.HTTP_200_OK)
@permission_classes([IsAuthenticated])    
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
    print("This is send sheduled mail")
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
        if isinstance(recipient_list, str):
            recipient_list = [recipient_list]

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

class RemarksViewSet(viewsets.ModelViewSet):
    queryset =Remarks.objects.all()
    serializer_class =RemarksSerializer
    @action(detail=False, methods=['get'])
    def by_enquiry_lead(self, request):
        enquiry_lead_id = request.query_params.get('enquiry_lead', None)
        if not enquiry_lead_id:
            return Response(
                {"error": "enquiry_lead parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        remarks = self.queryset.filter(enquiry_lead_id=enquiry_lead_id)
        serializer = self.get_serializer(remarks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
@permission_classes([IsAuthenticated])
def get_leads_by_telecaller(request):
    # Retrieve data from request
    telecaller_name = request.data.get('telecaller')
    lead_count = int(request.data.get('numberOfLeads', 0))
    sample_leads = request.data.get('leads', [])
    print("Sample Leads:", sample_leads)
    print("Lead Count:", lead_count)
    ids = [item['id'] for item in sample_leads]
    # Validate the telecaller
    telecaller = EnquiryTelecaller.objects.filter(name=telecaller_name).first()
    print("Telecaller:", telecaller)
    if not telecaller:
        return Response({"error": "Telecaller not found"}, status=status.HTTP_404_NOT_FOUND)

    # Filter leads that are unassigned and match IDs in sample_leads
    leads = Enquiry_Leads.objects.filter(
        Q(assigned__isnull=True) & Q(id__in=ids)
    )[:lead_count]  # Limit results to lead_count
    print("Filtered Leads:", leads)

    if not leads:
        return Response({"error": "No matching leads found"}, status=status.HTTP_404_NOT_FOUND)

    # Assign leads to telecaller and save
    for lead in leads:
        telecaller.assigned_lead.add(lead)
        telecaller.save()
        lead.assigned = True
        lead.save()
        Remarks.objects.create(
            enquiry_lead=lead,  # Link the remark to the current lead
            status='default',   # Default status for the remark
            remark_text='none'  # Default remark text
        )
    # Serialize and return the leads
    serialized_leads = LeadSerializer(leads, many=True).data
    return Response(serialized_leads, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_workshopleads_by_telecaller(request):
    telecaller_name = request.data.get('telecaller')
    lead_count = int(request.data.get('numberOfLeads', 0))
    sample_leads=request.data.get('leads')
    ids = [item['id'] for item in sample_leads]
    print(sample_leads)
    print(lead_count)
    telecaller = EnquiryTelecaller.objects.filter(name=telecaller_name).first()
    print(telecaller)
    if not telecaller:
        return Response({"error": "Telecaller not found"}, status=status.HTTP_404_NOT_FOUND)

    #leads =Workshop_Leads.objects.filter(assigned__isnull=True)[lead_count:]
    leads =Workshop_Leads.objects.filter(
        Q(assigned__isnull=True) & Q(id__in=ids)
    )[:lead_count]  # Limit results to lead_count
    print("Filtered Leads:", leads)
    print(leads) 
    i=0       
    for lead in leads:
        print(i+1)
        telecaller.assigned_workshop_lead.add(lead)
        telecaller.save()
        lead.assigned = True  
        lead.save()
        Remarks.objects.create(
            workshop_lead=lead,  # Link the remark to the current lead
            status='default',   # Default status for the remark
            remark_text='none'  # Default remark text
        )
    
    serialized_leads = WorkshopSerializer(leads, many=True).data
    return Response(serialized_leads, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unassigned_enquiry_telecaller(request):
    leads = Enquiry_Leads.objects.filter(assigned__isnull=True)
    serialized_leads = LeadSerializer(leads, many=True).data
    return Response(serialized_leads, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assigned_enquiry_telecaller(request):
    leads = Enquiry_Leads.objects.filter(assigned=True)
    serialized_leads = LeadSerializer(leads, many=True).data
    return Response(serialized_leads, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_unassigned_workshop_telecaller(request):
    leads = Workshop_Leads.objects.filter(assigned__isnull=True)
    serialized_leads = WorkshopSerializer(leads, many=True).data
    return Response(serialized_leads, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assigned_workshop_telecaller(request):
    leads = Workshop_Leads.objects.filter(assigned=True)
    serializer = WorkshopSerializer(leads, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class RemarkViewSet(viewsets.ViewSet):
    queryset = Remarks.objects.all()

    @action(detail=True, methods=['put'], url_path='update_remark')
    def update_remark(self, request, pk=None):
        """
        Update the remark for a specific Enquiry Lead
        """
        print(pk)
        try:
            # Retrieve the Remark instance based on enquiry_lead_id (passed as `pk`)
            remark = Remarks.objects.get(enquiry_lead_id=pk)
            
            # Validate and update the Remark using the RemarkSerializer
            serializer = RemarkSerializer(remark, data=request.data, partial=True)  # partial=True to allow partial updates
            if serializer.is_valid():
                serializer.save()  # Save the updated remark
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Remarks.DoesNotExist:
            return Response({"detail": "Remark not found."}, status=status.HTTP_404_NOT_FOUND)

class RemarkWorkshopLeadViewSet(viewsets.ViewSet):
    queryset = Remarks.objects.all()

    @action(detail=True, methods=['put'], url_path='update_remark_workshop')
    def update_remark(self, request, pk=None):
        """
        Update the remark for a specific Enquiry Lead
        """
        print(pk)
        try:
            # Retrieve the Remark instance based on enquiry_lead_id (passed as `pk`)
            remark = Remarks.objects.get(workshop_lead_id=pk)
            print("sss")
            # Validate and update the Remark using the RemarkSerializer
            serializer = RemarkSerializer(remark, data=request.data, partial=True)  # partial=True to allow partial updates
            print(serializer)
            if serializer.is_valid():
                serializer.save()  # Save the updated remark
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Remarks.DoesNotExist:
            return Response({"detail": "Remark not found."}, status=status.HTTP_404_NOT_FOUND)


class SendSMSView(APIView):
    def post(self, request):
        phone_number = request.data.get('phone_number')  # The recipient's phone number
        message = request.data.get('message')  # The message to send

        if not phone_number or not message:
            return Response({"error": "Phone number and message are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Initialize the Vonage client using the API Key and Secret
            client = vonage.Client(key=settings.VONAGE_API_KEY, secret=settings.VONAGE_API_SECRET)
            
            # Create a Vonage SMS object to send SMS
            sms = vonage.Sms(client)

            # Send the SMS message
            responseData = sms.send_message({
                'from': settings.VONAGE_PHONE_NUMBER,  # Your Vonage phone number
                'to': phone_number,  # Recipient's phone number
                'text': message,  # Message content
            })

            # Check the response status
            if responseData["messages"][0]["status"] == "0":
                return Response({"message": "SMS sent successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Failed to send SMS"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class TelecallerPageView(APIView):
    def get(self, request):
        leads = Enquiry_Leads.objects.filter(assigned=True)
        print(leads)
        remarks = Remarks.objects.exclude(enquiry_lead__isnull=True)
        print(leads)
        # Debugging to confirm the fetched data
        #print("Leads:", leads)
        for i in leads:
           print("Remarks:", i.course)
        matching_data = []

        for lead in leads:
            for remark in remarks:
                if lead.id == remark.enquiry_lead.id:  # Adjust field name if necessary
                    matching_data.append({
                        "lead_id": lead.id,
                        "lead_name": lead.name,
                        "lead_email": lead.email,
                        "remark_id": remark.id,
                        "course" :getattr(lead.course, 'name', None),
  # Adjust field name as necessary
                        "phone_number": lead.phone_number,
                        "remark_text": remark.remark_text,
                        "status": remark.status,
                        "remark_date": remark.created_at,
                    })
        print(matching_data)
        if matching_data:
            return Response({"message": "data sent successfully", "data": matching_data},
                status=status.HTTP_200_OK)

        return Response({"message": "No matching data found"}, status=status.HTTP_400_BAD_REQUEST)
    
class WorkshopTelecallerPageView(APIView):
    def get(self, request):
        leads = Workshop_Leads.objects.all()
        remarks = Remarks.objects.exclude(workshop_lead__isnull=True)  # Filter out NULL workshop_leads

        # Debugging to confirm the fetched data
        print("Leads:", leads)
        for i in Remarks.objects.all():
            if i.workshop_lead:  # Check if workshop_lead is not None
                print("Remarks (workshop lead exists):", i.workshop_lead.id)
            else:
                print("Remarks: No workshop lead assigned")

        matching_data = []

        for lead in leads:
            for remark in remarks:
                # Match leads with remarks based on workshop_lead
                if lead.id == remark.workshop_lead.id:  # Ensure correct comparison
                    matching_data.append({
                        "id":lead.id,
                        "lead_id": lead.orderId,
                        "lead_name": lead.customerName,
                        "lead_email": lead.customerEmail,
                        "remark_id": remark.id,
                        "amount": lead.amount,
                        "phone_number": lead.customerNumber,
                        "remark_text": remark.remark_text,
                        "status": remark.status,
                        "remark_date": remark.created_at,
                    })

        print("Matching Data:", matching_data)  # Debugging output
        if matching_data:
            return Response(
                {"message": "data sent successfully", "data": matching_data},
                status=status.HTTP_200_OK,
            )

        return Response({"message": "No matching data found"}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_excel(request):
    """
    API endpoint to download Excel containing data from the EnquiryLeads model.
    """
    # Query data from the EnquiryLeads model
    leads = Enquiry_Leads.objects.all().values('name', 'email', 'phone_number', 'course', 'created_at')
    #print(leads)
    # Convert queryset to DataFrame
    data = list(leads)
    for record in data:
        if isinstance(record['created_at'], datetime) and record['created_at'].tzinfo is not None:
            # Convert timezone-aware datetime to naive
            record['created_at'] = record['created_at'].astimezone().replace(tzinfo=None)
    
    df = pd.DataFrame(data)
    #print(df)
    # If the queryset is empty, provide default column names
    if df.empty:
        df = pd.DataFrame(columns=['name', 'email', 'phone_number', 'course', 'created_at'])

    # Create an in-memory Excel file
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Enquiry Leads')
    output.seek(0)  # Move to the beginning of the file

    # Define the filename
    filename = "enquiry_leads.xlsx"

    # Prepare the response
    response = HttpResponse(
        output, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_excel_workshop(request):
    # Query data from the Workshop_Leads model, excluding the created_at field
    leads = Workshop_Leads.objects.all().values(
        'customerName', 'customerEmail', 'customerNumber', 'orderDate', 
        'paymentStatus', 'location'  # Excluding 'created_at'
    )
    
    # Convert queryset to DataFrame
    data = list(leads)

    # Convert datetime fields to timezone-naive if needed
    for record in data:
        if isinstance(record['orderDate'], datetime) and record['orderDate'].tzinfo is not None:
            # Convert timezone-aware datetime to naive
            record['orderDate'] = record['orderDate'].astimezone().replace(tzinfo=None)

    # Create the DataFrame
    df = pd.DataFrame(data)

    # If the queryset is empty, provide default column names
    if df.empty:
        df = pd.DataFrame(columns=['customerName', 'customerEmail', 'customerNumber', 'orderDate', 'paymentStatus', 'location'])

    # Create an in-memory Excel file
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Workshop Leads')
    
    output.seek(0)  # Move to the beginning of the file

    # Define the filename
    filename = "workshop_leads.xlsx"

    # Prepare the response
    response = HttpResponse(
        output, content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    return response


class EnquiryLeadsList(APIView):
    def get(self, request):
        # Fetch leads with prefetch_related for optimization
        leads = Enquiry_Leads.objects.prefetch_related('assigned_telecaller', 'remarks').all()
        
        # Serialize leads data
        lead_serializer = EnquiryLeadsSerializer(leads, many=True)
        data = lead_serializer.data
        
        # Customize response to include status and followup_date directly
        for lead in data:
            # Process assigned_telecaller
            telecaller_data = lead.get('assigned_telecaller')
            if telecaller_data and isinstance(telecaller_data, list) and telecaller_data:
                lead['assigned_telecaller'] = telecaller_data[0].get('name', None)
            else:
                lead['assigned_telecaller'] = None
            
            # Process remarks to extract the first remark's status and followup_date
            remarks_data = lead.get('remarks')
            if remarks_data and isinstance(remarks_data, list) and len(remarks_data) > 0:
                # Extract the first remark
                first_remark = remarks_data[0]
                lead['status'] = first_remark.get('status', "None")
                lead['followup_date'] = first_remark.get('updated_at', "NULL")
            else:
                # Default values if no remarks
                lead['status'] = "None"
                lead['followup_date'] = "NULL"
            
            # Remove the remarks key as it's no longer needed
            lead.pop('remarks', None)
        
        return Response(data, status=status.HTTP_200_OK)
    
class WorkshopLeadsList(APIView):
    def get(self, request, *args, **kwargs):
        # Fetching the EnquiryTelecaller instance based on the provided ID in URL parameters
        telecaller_id = kwargs.get('id')  # Assuming you're passing the id as a URL parameter
        try:
            query_telecaller = EnquiryTelecaller.objects.get(id=telecaller_id)  # Correctly fetch by id
        except EnquiryTelecaller.DoesNotExist:
            return Response({"detail": "EnquiryTelecaller not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetching leads that are assigned to the telecaller
        leads = Workshop_Leads.objects.filter(assigned=True)

        # Filtering leads based on the assigned telecaller
        assigned_leads = query_telecaller.assigned_workshop_lead.all()  # Assuming it's a related field

        leads_data = []
        for lead in assigned_leads:  # Iterate over the leads assigned to this telecaller
            # Fetch remarks related to each lead
            lead_remarks = Remarks.objects.filter(workshop_lead=lead)

            # Collect remarks for each lead
            remarks_data = []
            for remark in lead_remarks:
                leads_data.append({
                    "status": remark.status,
                    "remark_text": remark.remark_text,
                    "updated_at": remark.updated_at,
                "id": lead.id,
                "name": lead.customerName,
                "email": lead.customerEmail,
                "phone_number": lead.customerNumber,
                "order_id": lead.orderId,
                 # Adding the status of the lead
                 # If available directly on the lead
               # If available
                 # Including remarks in the response
                "assigned_telecaller": query_telecaller.name,  # Adding the name of the telecaller
            })

        # Returning response with telecaller details and assigned leads
        return Response(leads_data, status=status.HTTP_200_OK)

class ContactCreateView(APIView):
    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)