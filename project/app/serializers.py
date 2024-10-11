from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Customer, Order, ServiceRequest
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
# crm/serializers.py
from rest_framework import serializers
from .models import  Customer, Product,Service
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

        # Check if the email already exists
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email already exists'})

        # Check if passwords match
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'Passwords do not match'})

        return data
    
    def create(self, validated_data):
        # Remove password_confirm from validated_data as it's not needed for user creation
        validated_data.pop('password_confirm')

        # Hash the password and create the user
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],  # Save email
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        print(username)
        # Check if user exists and authenticate
        user = authenticate(username=username, password=password)
        print(user)
        if user is None:
            raise serializers.ValidationError({'error': 'Invalid username or password'})
        
        # If valid, store the user in the instance for use later
        self.user = user
        return data

    def get_tokens_for_user(self):
        # After user is authenticated, generate tokens
        refresh = RefreshToken.for_user(self.user)

        return {
            'message': "Login successful",
            'data': {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        }

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ServiceRequestSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.first_name')  
    customer_last_name = serializers.CharField(source='customer.last_name')  
    product_name = serializers.CharField(source='product.name')  

    class Meta:
        model = ServiceRequest
        fields = ['id', 'issue_description', 'status', 'created_at', 'updated_at', 'customer_name', 'customer_last_name', 'product_name']

class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='service_request.customer.first_name')  # First name of the customer
    customer_last_name = serializers.CharField(source='service_request.customer.last_name')  # Last name of the customer
    product_name = serializers.CharField(source='service_request.product.name')  # Name of the product

    class Meta:
        model = Order
        fields = ['id', 'total_cost', 'is_paid', 'created_at', 'service_request', 'customer_name', 'customer_last_name', 'product_name']

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'