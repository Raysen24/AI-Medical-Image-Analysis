#!/bin/sh

python manage.py makemigrations
python manage.py migrate

python manage.py shell < start.py

python manage.py runserver 0.0.0.0:80

