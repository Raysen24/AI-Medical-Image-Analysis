from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone 
import datetime

class Hospital(models.Model):
    created_at = models.DateTimeField(default=datetime.datetime.now)
    updated_at = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, default='', unique=True)
    address = models.TextField(default='')
    phone = models.CharField(max_length=20, default='')
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return '{}'.format(self.name)

class CustomUserManager(BaseUserManager):
    def _create_user(self, email, fullname, phone, role, is_staff, is_active, password,
    **extra_fields):

        if not email:
            raise ValueError('The given username must be set')

        email = self.normalize_email(email)
        user = self.model(  email=email,
                            fullname=fullname,
                            phone=phone,
                            role=role,
                            is_staff=is_staff,
                            is_active=is_active,
                            **extra_fields)
        user.set_password(password)
        user.save(using=self.db)

        return user

    def create_user(self,  email, fullname, phone, role,  is_staff, is_active,password=None, **extra_fields):
        return self._create_user(email, fullname, phone, role, is_staff,True, password, **extra_fields)

    def create_superuser(self, email, fullname, phone, role, is_staff, is_active,password=None, **extra_fields):
        return self._create_user(email, fullname, phone, 'Admin',  True, True, password,  **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=timezone.now)
    email = models.EmailField(max_length=255, unique=True)
    fullname = models.CharField(max_length=255, default='')
    photo = models.FileField(upload_to='user/photo/', blank=True, null=True)
    phone = models.CharField(max_length=20, default='')
    ROLES = (
        ("Super Admin", "Super Admin"),
        ("System Admin", "System Admin"),
        ('Hospital Admin', 'Hospital Admin'),
        ('Hospital Management', 'Hospital Management'),
        ('Doctor', 'Doctor'),
        ('Nurse', 'Nurse'),
        ('Patient', 'Patient'),
    )
    role = models.CharField(max_length=100, choices=ROLES, default='Patient')
    dob = models.DateField(blank=True, null=True)
    LISTSEX = (
        ('Male', 'Male'), # 0
        ('Female', 'Female'), # 1
    )
    sex = models.CharField(max_length=100, choices=LISTSEX, null=True)
    mr_id_patient = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    province = models.CharField(max_length=255, blank=True, null=True)
    regency = models.CharField(max_length=255, blank=True, null=True)
    district = models.CharField(max_length=255, blank=True, null=True) # kecamatan
    subdistrict = models.CharField(max_length=255, blank=True, null=True) #kelurahan
    hospital = models.ManyToManyField(Hospital, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['fullname', 'phone', 'role', 'is_active', 'is_staff']

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        self.email = self.email.lower()
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.photo.delete()
        super().delete(*args, **kwargs)

    def __str__(self):
        return '{} / {}'.format(self.email, self.fullname)

class LoginActivity(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
    activity = models.CharField(max_length=255, default='')