# Generated by Django 5.1.3 on 2024-11-18 18:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_alter_remarks_enquiry_lead_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='remarks',
            name='workshop_lead',
        ),
        migrations.AddField(
            model_name='enquirytelecaller',
            name='assigned_workshop_lead',
            field=models.ManyToManyField(blank=True, null=True, related_name='workshop_telecaller_leads', to='app.workshop_leads'),
        ),
        migrations.AlterField(
            model_name='remarks',
            name='enquiry_lead',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='remarks', to='app.enquiry_leads'),
        ),
    ]
