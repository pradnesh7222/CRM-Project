from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(write_only=True)  # Hide password in response

    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Username already exists'})
        return data
    
    def create(self, validated_data):
        # Hash the password and create the user
        validated_data['password'] = make_password(validated_data['password'])
        user = User.objects.create(
            username=validated_data['username'],
            password=validated_data['password']  # The password is already hashed
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