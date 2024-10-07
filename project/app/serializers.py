from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Customer, Lead
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import re
from django.core.validators import EmailValidator

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

        # Check if user exists and authenticate
        user = authenticate(username=username, password=password)
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

# crm/serializers.py



class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'
