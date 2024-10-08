# crm/models.py
from django.db import models
from django.contrib.auth.models import User

# Lead model
class Lead(models.Model):
    LEAD_STATUS = (
        ('New', 'New'),
        ('Contacted', 'Contacted'),
        ('Qualified', 'Qualified'),
        ('Lost', 'Lost'),
    )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    company = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(choices=LEAD_STATUS, max_length=50, default='New')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


# Customer model
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    company_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    address = models.TextField()

    def __str__(self):
        return self.user.username


# Product model
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()

    def __str__(self):
        return self.name


# Opportunity model
class Opportunity(models.Model):
    STAGES = (
        ('Prospecting', 'Prospecting'),
        ('Negotiation', 'Negotiation'),
        ('Closed Won', 'Closed Won'),
        ('Closed Lost', 'Closed Lost'),
    )
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, null=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    stage = models.CharField(choices=STAGES, max_length=50)
    expected_revenue = models.DecimalField(max_digits=10, decimal_places=2)
    closing_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Opportunity for {self.product.name} - {self.stage}"
