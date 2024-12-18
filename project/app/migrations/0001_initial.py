# Generated by Django 5.1.2 on 2024-10-25 00:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Lead',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('states', models.CharField(choices=[('ap', 'Andhra Pradesh'), ('ar', 'Arunachal Pradesh'), ('as', 'Assam'), ('br', 'Bihar'), ('ch', 'Chhattisgarh'), ('ga', 'Goa'), ('gj', 'Gujarat'), ('hr', 'Haryana'), ('hp', 'Himachal Pradesh'), ('jh', 'Jharkhand'), ('ka', 'Karnataka'), ('kl', 'Kerala'), ('mp', 'Madhya Pradesh'), ('mh', 'Maharashtra'), ('mn', 'Manipur'), ('ml', 'Meghalaya'), ('mz', 'Mizoram'), ('nl', 'Nagaland'), ('or', 'Odisha'), ('pb', 'Punjab'), ('rj', 'Rajasthan'), ('sk', 'Sikkim'), ('tn', 'Tamil Nadu'), ('ts', 'Telangana'), ('tr', 'Tripura'), ('up', 'Uttar Pradesh'), ('ut', 'Uttarakhand'), ('wb', 'West Bengal')], max_length=100)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone_number', models.CharField(max_length=10)),
                ('address', models.TextField()),
                ('lead_score', models.IntegerField()),
                ('status', models.CharField(choices=[('Enquiry', 'Enquiry'), ('Follow Up', 'Follow Up'), ('Application', 'Application')], default='Enquiry', max_length=100)),
                ('notes', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Roles',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role_name', models.CharField(max_length=100)),
                ('permissions', models.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('states', models.CharField(choices=[('ap', 'Andhra Pradesh'), ('ar', 'Arunachal Pradesh'), ('as', 'Assam'), ('br', 'Bihar'), ('ch', 'Chhattisgarh'), ('ga', 'Goa'), ('gj', 'Gujarat'), ('hr', 'Haryana'), ('hp', 'Himachal Pradesh'), ('jh', 'Jharkhand'), ('ka', 'Karnataka'), ('kl', 'Kerala'), ('mp', 'Madhya Pradesh'), ('mh', 'Maharashtra'), ('mn', 'Manipur'), ('ml', 'Meghalaya'), ('mz', 'Mizoram'), ('nl', 'Nagaland'), ('or', 'Odisha'), ('pb', 'Punjab'), ('rj', 'Rajasthan'), ('sk', 'Sikkim'), ('tn', 'Tamil Nadu'), ('ts', 'Telangana'), ('tr', 'Tripura'), ('up', 'Uttar Pradesh'), ('ut', 'Uttarakhand'), ('wb', 'West Bengal')], max_length=100)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone_number', models.CharField(max_length=10)),
                ('date_of_birth', models.DateField()),
                ('address', models.TextField()),
                ('enrollment_status', models.CharField(choices=[('Active', 'Active'), ('Graduated', 'Graduated'), ('Dropped', 'Dropped')], default='Active', max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('courses', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.course')),
                ('lead_id', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app.lead')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Enrollment',
            fields=[
                ('enrollment_id', models.AutoField(primary_key=True, serialize=False)),
                ('enrollment_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('enrolled', 'Enrolled'), ('completed', 'Completed'), ('dropped_out', 'Dropped Out')], max_length=20)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='app.course')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='enrollments', to='app.student')),
            ],
        ),
        migrations.CreateModel(
            name='Communication',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('communication_type', models.CharField(choices=[('email', 'Email'), ('call', 'Call'), ('sms', 'SMS')], max_length=10)),
                ('content', models.TextField()),
                ('communication_date', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(max_length=20)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='communications', to=settings.AUTH_USER_MODEL)),
                ('lead', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='communications', to='app.lead')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='communications', to='app.student')),
            ],
        ),
        migrations.CreateModel(
            name='Users',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone_number', models.CharField(max_length=10)),
                ('status', models.CharField(choices=[('Active', 'Active'), ('InActive', 'InActive')], default='Active', max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('role', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='app.roles')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='student',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.users'),
        ),
        migrations.AddField(
            model_name='lead',
            name='assigned_to_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.users'),
        ),
        migrations.AddField(
            model_name='course',
            name='Instructor',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.users'),
        ),
    ]
