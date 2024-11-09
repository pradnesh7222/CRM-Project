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
from .models import Communication, CommunicationHistory, Course, Enquiry_Leads, EnquiryTelecaller, Enrollment, Installment, Roles, Users, Student, Workshop_Leads, WorkshopTelecaller

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

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user', 'first_name', 'last_name', 'email', 'phone_number', 'status', 'created_at', 'updated_at','role']


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry_Leads
        fields = '__all__'

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
    class Meta:
        model = EnquiryTelecaller
        fields = '__all__'

class WorkshopTelecallerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopTelecaller
        fields = '__all__'