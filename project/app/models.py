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
        return f"{self.user.first_name} "

class Course(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField()
    price=models.DecimalField(max_digits=10,decimal_places=2)
    Instructor=models.ForeignKey(Users,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image=models.ImageField(upload_to='courses/',null=True)
    def __str__(self):
        return f"{self.name}"
    
class Enquiry_Leads(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True) 
    phone_number = models.CharField(max_length=10)
    '''
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
    '''
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    course=models.ForeignKey(Course,on_delete=models.CASCADE,null=True)
    def __str__(self):
        return f"Lead: {self.first_name} {self.last_name}"

class Workshop_Leads(models.Model):
    orderId=models.CharField(unique=True,max_length=100)
    customerName=models.CharField(max_length=100)
    customerNumber=models.CharField(max_length=10)
    customerEmail=models.EmailField()
    orderDate=models.DateTimeField(auto_created=True)
    amount=models.IntegerField()
    paymentStatus=models.CharField(max_length=100,choices=[
            ('Payment not done', 'Payment not done'),
            ('Payment done', 'Payment done')
        ])
    
    codingLevel=models.CharField(null=True,max_length=100)
    location=models.CharField(max_length=100,choices=[
            ('Mumbai', 'Mumbai'),
            ('Bengaluru', 'Bengaluru')
        ])
    is_deleted = models.BooleanField(default=False)

class Student(BaseModel):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True) 
    phone_number = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)   
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
    lead_id=models.ForeignKey(Enquiry_Leads,on_delete=models.CASCADE,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    courses = models.ForeignKey('Course',on_delete=models.CASCADE )

    deleted = models.BooleanField(default=False)  # Soft delete flag

    def delete(self, args, *kwargs):
        """Override delete method to perform a soft delete."""
        self.deleted = True
        self.save()

    def __str__(self):
        return f"Student: {self.first_name} {self.last_name}"

class Communication(models.Model):
    COMMUNICATION_TYPES = [
        ('email', 'Email'),
        ('call', 'Call'),
        ('sms', 'SMS'),
    ]

    lead = models.ForeignKey('Enquiry_Leads', on_delete=models.CASCADE, related_name='communications', null=True, blank=True)
    student = models.ForeignKey('Student', on_delete=models.CASCADE, related_name='communications', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='communications')
    communication_type = models.CharField(max_length=10, choices=COMMUNICATION_TYPES)
    content = models.TextField(null=True,blank=True)
    communication_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.communication_type} - {self.content[:20]}..."

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        CommunicationHistory.objects.create(
            communication=self,
            communication_type=self.communication_type,
            content=self.content,
            status=self.status,
            communication_date=self.communication_date
        )

class CommunicationHistory(models.Model):
    communication = models.ForeignKey(Communication, on_delete=models.CASCADE, related_name='history')
    communication_type = models.CharField(max_length=10, choices=Communication.COMMUNICATION_TYPES)
    content = models.TextField()
    communication_date = models.DateTimeField()
    status = models.CharField(max_length=20)

    def __str__(self):
        return f"History: {self.communication_type} - {self.content[:20]}..."

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