from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from app.serializers import CustomerSerializer, LoginSerializer, RegistrationSerializer
from app.models import Customer
from rest_framework import viewsets
from .models import  Customer, Order, Product, Service, ServiceRequest
from .serializers import  CustomerSerializer, OrderSerializer,  ProductSerializer, ServiceRequestSerializer, ServiceSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework import filters 
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics, permissions
from django.contrib.auth import logout
class RegistrationView(APIView):
    @csrf_exempt
    def post(self, request):
        try:
            data = request.data
            print("1")
            print(data)
            serializer = RegistrationSerializer(data=data)
            if not serializer.is_valid():
                print("2")
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
            print(e)
            return Response({
                'status': status.HTTP_500_INTERNAL_SERVER_ERROR,
                'message': f'Something went wrong: {str(e)}'
            })

class Login(APIView):
    #permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            data = request.data
            serializer = LoginSerializer(data=data)
            print("data",data)
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

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is logged in

    def post(self, request):
        logout(request)  # Django's built-in logout function
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)   
class CustomerViewSet(viewsets.ModelViewSet):
    #authentication_classes = [JWTAuthentication] 
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'email']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'category', 'description'] 

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['issue_description', 'status']  

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['total_cost']  
    
class ServiceViewSet(viewsets.ModelViewSet):
    queryset =  Service.objects.all()
    serializer_class =  ServiceSerializer