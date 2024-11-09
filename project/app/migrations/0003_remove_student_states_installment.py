# Generated by Django 5.1.3 on 2024-11-07 04:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_alter_workshop_leads_location_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='student',
            name='states',
        ),
        migrations.CreateModel(
            name='Installment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, default=25000, max_digits=10)),
                ('due_date', models.DateField()),
                ('payment_date', models.DateField(blank=True, null=True)),
                ('is_paid', models.BooleanField(default=False)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='installments', to='app.student')),
            ],
        ),
    ]
