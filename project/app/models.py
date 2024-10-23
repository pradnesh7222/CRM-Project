from django.db import models
from django.contrib.auth.models import User
class BaseModel(models.Model):
    states=models.CharField(max_length=100,choices=[
            ('ap', 'Andhra Pradesh'),
            ('ar', 'Arunachal Pradesh'),
            ('as', 'Assam'),
            ('br', 'Bihar'),
            ('ch', 'Chhattisgarh'),
            ('ga', 'Goa'),
            ('gj', 'Gujarat'),
            ('hr', 'Haryana'),
            ('hp', 'Himachal Pradesh'),
            ('jh', 'Jharkhand'),
            ('ka', 'Karnataka'),
            ('kl', 'Kerala'),
            ('mp', 'Madhya Pradesh'),
            ('mh', 'Maharashtra'),
            ('mn', 'Manipur'),
            ('ml', 'Meghalaya'),
            ('mz', 'Mizoram'),
            ('nl', 'Nagaland'),
            ('or', 'Odisha'),
            ('pb', 'Punjab'),
            ('rj', 'Rajasthan'),
            ('sk', 'Sikkim'),
            ('tn', 'Tamil Nadu'),
            ('ts', 'Telangana'),
            ('tr', 'Tripura'),
            ('up', 'Uttar Pradesh'),
            ('ut', 'Uttarakhand'),
            ('wb', 'West Bengal'),
        
    ])
  

    class Meta:
        abstract = True
class Users(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True) 
    phone_number = models.CharField(max_length=10)
    status = models.CharField(
        max_length=100,
        choices=[
            ('Active', 'Active'),
            ('InActive', 'InActive')
        ],
        default='Active'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Lead(BaseModel):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True) 
    phone_number = models.CharField(max_length=10)
    assigned_to_user = models.ForeignKey(Users, on_delete=models.CASCADE)
    #lead_score_id=models.ForeignKey(lead_score,on_delete=models.CASCADE)
    lead_score = models.IntegerField()
    status = models.CharField(
        max_length=100,
        choices=[
            ('Enquiry', 'Enquiry'),
            ('Follow Up', 'Follow Up'),
            ('Application', 'Application')
        ],
        default='Enquiry'
    )
    notes = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lead: {self.first_name} {self.last_name}"


class Student(BaseModel):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True) 
    phone_number = models.CharField(max_length=10)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)  
    date_of_birth = models.DateField()
    address = models.TextField()
    enrollment_status = models.CharField(
        max_length=100,
        choices=[
            ('Active', 'Active'),
            ('Graduated', 'Graduated'),
            ('Dropped', 'Dropped')
        ],
        default='Active'  
    )
    lead_id=models.ForeignKey(Lead,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Student: {self.first_name} {self.last_name}"

class Roles(models.Model):
    role_name = models.CharField(max_length=100)
    permissions = models.JSONField()  

    def __str__(self):
        return self.role_name
    
class Course(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()
    price=models.DecimalField(max_digits=10,decimal_places=2)
    Instructor=models.ForeignKey(Users,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
