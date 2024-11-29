# CRM-Project
# CRM-Project
how to run this project
1.python -m venv env
2.env/scripts/activate
3.cd project
4.pip install django djangorestframework djangorestframework-simplejwt django-cors-headers mysqlclient celery pandas drf_yasg pillow Redis openpyxl

9.python manage.py makemigrations
10.python manage.py migrate
11.python manage.py runserver


how to run this project after installation
1.env/scripts/activate
2.cd project
3.python manage.py runserver

how to run this celery after 
1.env/scripts/activate
2.cd project
3.celery -A project worker --loglevel=info