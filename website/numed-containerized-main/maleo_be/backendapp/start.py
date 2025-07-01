from account.models import CustomUser 

try:
    CustomUser.objects.create_superuser('a@a.com', 'a', '0', 'Super Admin', True, True, 'byornexpert') 
    a=CustomUser.objects.get(email='a@a.com')
    a.is_superuser=True
    a.save()
except Exception as e:
    print(str(e))