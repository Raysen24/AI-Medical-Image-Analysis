from atexit import register
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, Hospital, LoginActivity
from import_export.admin import ImportExportModelAdmin

class UserAdmin(BaseUserAdmin, ImportExportModelAdmin):
    fieldsets = (
        (None, {
            'fields': (
                'created_at', 'photo', 'email', 'fullname', 'phone',
                'role', 'dob', 'sex', 'address', 'mr_id_patient', 
                'province', 'regency', 'district', 'subdistrict',
                'hospital', 'password'
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active', 'is_staff', 'is_superuser'
            )}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields':(
                'created_at', 'photo', 'email', 'fullname', 'phone',
                'role', 'dob', 'sex', 'address',  'mr_id_patient', 
                'province', 'regency', 'district', 'subdistrict',
                'hospital', 'password1', 'password2',
            )
        }),
    )
    list_display = ['created_at', 'email', 'fullname', 'role', 'is_active']
    search_fields = ['email', 'fullname', 'role']
    ordering = ['-created_at', 'role', 'email']
    
admin.site.register(CustomUser, UserAdmin)

class HospitalAdmin(ImportExportModelAdmin):
    list_display = ['name', 'address', 'phone', 'is_active']
    search_fields = ['name', 'address', 'phone']
    list_filter = ['is_active']
    ordering = ['name']

admin.site.register(Hospital, HospitalAdmin)

class LoginActivityAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'user_id', 'activity']
    search_fields = ['created_at', 'user_id__fullname', 'user_id__email', 'activity']
    ordering = ['-created_at']

admin.site.register(LoginActivity, LoginActivityAdmin)
