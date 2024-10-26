from django.db import models
from django.contrib.auth.models import User

class Roles(models.Model):
    role_name = models.CharField(max_length=100)
    permissions = models.JSONField()  

    def __str__(self):
        return self.role_name
    
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
    role = models.ForeignKey(Roles, on_delete=models.SET_NULL, null=True, blank=True)
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
        return f"{self.user} "


class Lead(BaseModel):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True) 
    phone_number = models.CharField(max_length=10)
    assigned_to_user = models.ForeignKey(Users, on_delete=models.CASCADE)
    address=models.TextField()
    #lead_source=models.ForeignKey(lead_score,on_delete=models.CASCADE
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
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

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
    lead_id=models.ForeignKey(Lead,on_delete=models.CASCADE,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    courses = models.ForeignKey('Course',on_delete=models.CASCADE ) 
    def __str__(self):
        return f"Student: {self.first_name} {self.last_name}"

class Communication(models.Model):
    COMMUNICATION_TYPES = [
        ('email', 'Email'),
        ('call', 'Call'),
        ('sms', 'SMS'),
        # Add other communication types as needed
    ]

    id = models.AutoField(primary_key=True)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='communications')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='communications')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='communications')
    communication_type = models.CharField(max_length=10, choices=COMMUNICATION_TYPES)
    content = models.TextField()
    communication_date = models.DateTimeField(auto_now_add=True)  # Set to now when created
    status = models.CharField(max_length=20)  # You can define choices here if needed

    def __str__(self):
        return f"{self.communication_type} - {self.content[:20]}..." 
class Course(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()
    price=models.DecimalField(max_digits=10,decimal_places=2)
    Instructor=models.ForeignKey(Users,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}"
class Enrollment(models.Model):
    STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('completed', 'Completed'),
        ('dropped_out', 'Dropped Out'),
    ]

    enrollment_id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrollment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    def __str__(self):
        return f"{self.student} enrolled in {self.course} - Status: {self.status}"