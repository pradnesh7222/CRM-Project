from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from app.serializers import CustomerSerializer, LeadSerializer, LoginSerializer, RegistrationSerializer
from app.models import Customer, Lead
from rest_framework import viewsets
from .models import Lead, Customer, Product, Opportunity
from .serializers import LeadSerializer, CustomerSerializer,  PasswordResetSerializer, ProductSerializer, OpportunitySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework import filters 
from django.views.decorators.csrf import csrf_exempt


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
class PasswordResetRequestView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset link has been sent."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class PasswordResetConfirmView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    #permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone_number']
    # Convert lead to customer
    @action(detail=True, methods=['post'])
    def convert_to_customer(self, request, pk=None):
        lead = self.get_object()
        user = User.objects.create(username=lead.email, email=lead.email)
        customer = Customer.objects.create(user=user, phone_number=lead.phone_number)
        return Response({'status': 'Lead converted to customer', 'customer_id': customer.id})

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    #permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username', 'company_name', 'phone_number', 'address']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    #permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description']

class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunitySerializer
    #permission_classes = [IsAuthenticated]

    filter_backends = [filters.SearchFilter]
    search_fields = ['lead__first_name', 'lead__last_name', 'customer__company_name', 'product__name', 'stage']
