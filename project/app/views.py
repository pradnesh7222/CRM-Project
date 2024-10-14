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
    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            tokens = serializer.get_tokens_for_user()
            return Response(tokens, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class LogoutView(APIView):
    #permission_classes = [IsAuthenticated]  # Ensure the user is logged in

    def post(self, request):
        logout(request)  
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
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_paid(self, request, pk=None):
        """
        Custom action to mark an order as paid and update the customer status to 'Qualified'.
        """
        order = self.get_object()
        order.is_paid = True
        order.save()

        # Update customer status to 'Qualified'
        customer = order.service_request.customer
        customer.status = 'Qualified'
        customer.save()

        return Response({'message': 'Order marked as paid and customer status updated'})
    
class ServiceViewSet(viewsets.ModelViewSet):
    queryset =  Service.objects.all()
    serializer_class =  ServiceSerializer