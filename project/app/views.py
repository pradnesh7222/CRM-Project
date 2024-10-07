from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from app.serializers import CustomerSerializer, LeadSerializer, LoginSerializer, RegistrationSerializer
from app.models import Customer, Lead

class RegistrationView(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = RegistrationSerializer(data=data)
            if not serializer.is_valid():
                return Response({
                    'status': status.HTTP_400_BAD_REQUEST,
                    'message': 'Invalid input',
                    'errors': serializer.errors
                })
            serializer.save()
            return Response({
                'status': status.HTTP_201_CREATED,
                'message': 'Your account has been created',
                'data': serializer.data
            })
        except Exception as e:
            return Response({
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR,
                'message': f'Something went wrong: {str(e)}'
            })

class Login(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = LoginSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                tokens = serializer.get_tokens_for_user()
                return Response({
                    'status': status.HTTP_200_OK,
                    **tokens
                })
        except Exception as e:
            return Response({
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR,
                'message': f'Something went wrong: {str(e)}'
            })
class CustomerListCreate(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class LeadListCreate(generics.ListCreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer