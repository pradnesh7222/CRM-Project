from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import re
from django.core.validators import EmailValidator
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import update_session_auth_hash
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers
from .models import Communication, CommunicationHistory, Contact, Course, Enquiry_Leads, EnquiryTelecaller, Enrollment, Installment, LeadAssignment, LeadSource, Remarks, Roles, Users, Student, Workshop_Leads, WorkshopTelecaller

from rest_framework import serializers
from django.contrib.auth.forms import PasswordResetForm
class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    email = serializers.EmailField(
        max_length=255,
        validators=[EmailValidator(message="Invalid email format")]  
    )
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    def validate_password(self, value):
        """
        Add custom validation for password strength
        """
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Username already exists'})

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email already exists'})

        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})

        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')  # Remove password_confirm

        # Create user in Django's User model
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            password=make_password(validated_data['password'])
        )

        # Create an entry in the custom Users model
        Users.objects.create(
            user=user,
           
            email=validated_data['email'],
            
        )

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        # Authenticate user
        user = authenticate(username=username, password=password)
        if user is None:
            raise serializers.ValidationError({'error': 'Invalid username or password'})

        # Check if the associated custom Users entry exists
        if not hasattr(user, 'users'):
            raise serializers.ValidationError({'error': 'User profile not found'})

        self.user = user
        return data

    def get_tokens_for_user(self):
        refresh = RefreshToken.for_user(self.user)
        return {
            'message': "Login successful",
            'data': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        }
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New password and confirm password do not match.")
        return data
class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user', 'first_name', 'last_name', 'email', 'phone_number', 'status', 'created_at', 'updated_at','role']


class LeadSerializer(serializers.ModelSerializer):
    course_name = serializers.ReadOnlyField(source='course.name')
    lead_name = serializers.ReadOnlyField(source='lead_source.name')
    print(LeadSource)
    class Meta:
        model = Enquiry_Leads
        fields = ['id', 'name', 'email', 'phone_number', 'course_name','course','lead_source','lead_name']
        

class WorkshopSerializer(serializers.ModelSerializer):
    class Meta:
        model=Workshop_Leads
        fields = '__all__'
class StudentSerializer(serializers.ModelSerializer):
    total_fees_paid = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )
    next_due_date = serializers.DateField(read_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number', 'date_of_birth',
            'address', 'enrollment_status', 'courses', 'total_fees_paid', 'next_due_date','user'
        ]
class InstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Installment
        fields = '__all__'
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    #Instructor=UsersSerializer()
    class Meta:
        model = Course
        fields = '__all__'

class CommunicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Communication
        fields = '__all__' 

class EnrollmentSerializer(serializers.ModelSerializer):
    #student = StudentSerializer()  # Use nested serializer for student
    #course = CourseSerializer() 
    class Meta:
        model = Enrollment
        fields = '__all__'  

class CommunicationHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunicationHistory
        fields = '__all__'

class EnquiryTelecallerSerializer(serializers.ModelSerializer):
    assigned_lead = LeadSerializer(many=True, read_only=True)  # Nested serializer for Enquiry_Leads
    assigned_workshop_lead = WorkshopSerializer(many=True, read_only=True)  # Nested serializer for Workshop_Leads
    #assigned_to = serializers.CharField(source='user.name')  # This will return the name of the telecaller

    class Meta:
        model = EnquiryTelecaller
        fields = [
            'id', 'name', 'email', 'phone_number',  
            'status', 'follow_up_date', 'assigned_lead', 'assigned_workshop_lead', 'location'
        ]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
class WorkshopTelecallerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopTelecaller
        fields = '__all__'

class LeadAssignmentSerializer(serializers.Serializer):
    lead_type = serializers.ChoiceField(choices=LeadAssignment.LEAD_TYPE_CHOICES)
    lead_name = serializers.CharField(write_only=True) 
    assigned_user = serializers.CharField(write_only=True) 

    def validate(self, data):
        lead_type = data['lead_type']
        lead_name = data['lead_name']
        assigned_user = data['assigned_user']
        
        if lead_type == 'enquiry':
            lead = Enquiry_Leads.objects.filter(name=lead_name).first()
            if not lead:
                raise serializers.ValidationError("Enquiry lead with this name does not exist.")
            lead_id = lead.id
        elif lead_type == 'workshop':
            lead = Workshop_Leads.objects.filter(customerName=lead_name).first()
            if not lead:
                raise serializers.ValidationError("Workshop lead with this name does not exist.")
            lead_id = lead.id
        else:
            raise serializers.ValidationError("Invalid lead type.")


        assigned_to = User.objects.filter(username=assigned_user).first()
        if not assigned_to:
            raise serializers.ValidationError("User with this username does not exist.")
        
        data['lead_id'] = lead_id
        data['assigned_to'] = assigned_to
        return data

    def create(self, validated_data):
        lead_assignment = LeadAssignment.objects.create(
            lead_type=validated_data['lead_type'],
            lead_id=validated_data['lead_id'],
            assigned_to=validated_data['assigned_to'],
        )
        return lead_assignment

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.lead_type == 'enquiry':
            lead = Enquiry_Leads.objects.filter(id=instance.lead_id).first()
            lead_name = lead.name if lead else None
        elif instance.lead_type == 'workshop':
            lead = Workshop_Leads.objects.filter(id=instance.lead_id).first()
            lead_name = lead.customerName if lead else None
        else:
            lead_name = None
        representation['lead_name'] = lead_name
        representation['assigned_user'] = instance.assigned_to.username
        return representation

class RemarksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remarks
        fields = '__all__'
class RemarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Remarks
        fields = ['status', 'remark_text', 'created_at'] 
class EnquiryLeadsSerializer(serializers.ModelSerializer):
    assigned_telecaller = LeadSerializer(many=True, read_only=True)
    remarks=RemarksSerializer(many=True, read_only=True)
    class Meta:
        model = EnquiryTelecaller
        fields = ['name', 'email', 'phone_number', 'assigned_telecaller','remarks']

class WorkshopLeadSerializer(serializers.ModelSerializer):
    assigned_workshop_lead = WorkshopSerializer(many=True, read_only=True)  # Fetch related Workshop_Leads
    remarks = RemarksSerializer(many=True, read_only=True)  # Fetch related Remarks

    # Fields for customer data
    customer_name = serializers.SerializerMethodField()
    customer_number = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()

    class Meta:
        model = EnquiryTelecaller
        fields = ['name', 'email', 'phone_number', 'assigned_workshop_lead', 'remarks', 'customer_name', 'customer_number', 'customer_email']

    # Method to fetch customerName from related Workshop_Leads (assigned_workshop_lead)
    def get_customer_name(self, obj):
        # Fetching the customerName from the first related workshop lead
        if obj.assigned_workshop_lead.exists():
            return obj.assigned_workshop_lead.first().customerName
        return None

    # Method to fetch customerNumber from related Workshop_Leads (assigned_workshop_lead)
    def get_customer_number(self, obj):
        # Fetching the customerNumber from the first related workshop lead
        if obj.assigned_workshop_lead.exists():
            return obj.assigned_workshop_lead.first().customerNumber
        return None

    # Method to fetch customerEmail from related Workshop_Leads (assigned_workshop_lead)
    def get_customer_email(self, obj):
        # Fetching the customerEmail from the first related workshop lead
        if obj.assigned_workshop_lead.exists():
            return obj.assigned_workshop_lead.first().customerEmail
        return None

class LeadSourceserializer(serializers.ModelSerializer):
    class Meta:
        model = LeadSource
        fields = '__all__'


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'phone_number', 'date']
