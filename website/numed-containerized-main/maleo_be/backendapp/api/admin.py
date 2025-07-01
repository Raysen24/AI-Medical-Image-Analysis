from atexit import register
from django.contrib import admin
from . import models
from import_export.admin import ImportExportModelAdmin


class CXRAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'id', 'patient_id', 'upload_by', 'image', 'image_result']
    search_fields = ['id', 'patient_id__email', 'patient_id__fullname', 'upload_by__email', 'upload_by__fullname']
    ordering = ['-created_at']
    autocomplete_fields = ['medical_id', 'patient_id', 'upload_by', 'hospital_id', 'doctor_id']

admin.site.register(models.CXR, CXRAdmin)

class CTScanAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'id', 'patient_id', 'upload_by', 'image', 'image_result']
    search_fields = ['id', 'patient_id__email', 'patient_id__fullname', 'upload_by__email', 'upload_by__fullname']
    ordering = ['-created_at']
    autocomplete_fields = ['medical_id', 'patient_id', 'upload_by', 'hospital_id', 'doctor_id']

admin.site.register(models.CTScan, CTScanAdmin)

class BloodTestAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'id', 'patient_id', 'upload_by', 'probapredict', 'classpredict']
    search_fields = ['id', 'patient_id__email', 'patient_id__fullname', 'upload_by__email', 'upload_by__fullname']
    ordering = ['-created_at']
    autocomplete_fields = ['medical_id', 'patient_id', 'upload_by', 'hospital_id']

admin.site.register(models.BloodTest, BloodTestAdmin)

class HistoryActivityAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'patient_id', 'type']
    search_fields = ['id', 'patient_id__email', 'patient_id__fullname']
    autocomplete_fields = ['patient_id']
    ordering = ['-created_at']

admin.site.register(models.HistoryActivity, HistoryActivityAdmin)

class MedicalRecordAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'mr_id_patient', 'patient_id', 'room_id']
    search_fields = ['mr_id_patient', 'patient_id__email', 'patient_id__fullname']
    autocomplete_fields = ['patient_id', 'hospital_id', 'building_id', 'room_id', 'bed_id']
    ordering = ['-created_at']
    
admin.site.register(models.MedicalRecord, MedicalRecordAdmin)

class SoapAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'medical_id', 'patient_id', 'created_by']
    autocomplete_fields = ['medical_id', 'patient_id', 'created_by']
    search_fields = ['medical_id__mr_id_patient', 'patient_id__fullname', 'created_by__fullname']
    ordering = ['-created_at']

admin.site.register(models.Soap, SoapAdmin)

class OtherNoteAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'medical_id', 'patient_id', 'upload_by']
    autocomplete_fields = ['medical_id', 'patient_id', 'upload_by', 'hospital_id']
    search_fields = ['medical_id__mr_id_patient', 'patient_id__fullname', 'upload_by__fullname']
    ordering = ['-created_at']

admin.site.register(models.OtherNote, OtherNoteAdmin)

# class MedicalRecordNotificationAdmin(ImportExportModelAdmin):
#     list_display = ['created_at', 'medical_id', 'is_read']
#     search_fields = ['is_read']
#     autocomplete_fields = ['medical_id']
#     ordering = ['-created_at']
    
# admin.site.register(models.MedicalRecordNotification, MedicalRecordNotificationAdmin)

class SettingAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'key', 'value']
    search_fields = ['key', 'value']
    ordering = ['-created_at']

admin.site.register(models.Setting, SettingAdmin)

class BedAdmin(ImportExportModelAdmin):
    list_display = ['room_id', 'bed_number', 'is_occupied']
    search_fields = ['room_id__room_name']
    autocomplete_fields = ['room_id']
    list_filter = ['room_id']
    ordering = ['room_id']

admin.site.register(models.Bed, BedAdmin)

class BuildingHospitalAdmin(ImportExportModelAdmin):
    list_display = ['hospital_id', 'name']
    autocomplete_fields = ['hospital_id']
    list_filter = ['hospital_id']
    search_fields = ['name']
    ordering = ['hospital_id']

admin.site.register(models.BuildingHospital, BuildingHospitalAdmin)

class RoomAdmin(ImportExportModelAdmin):
    list_display = ['building_id', 'room_name', 'room_number', 'is_active']
    autocomplete_fields = ['building_id']
    list_filter = ['building_id']
    search_fields = ['room_name', 'room_number']
    ordering = ['building_id']

admin.site.register(models.Room, RoomAdmin)

class ProvinceAdmin(ImportExportModelAdmin):
    list_display = ['unique_id', 'name']
    search_fields =  ['unique_id', 'name']
    ordering = ['unique_id']

admin.site.register(models.Province, ProvinceAdmin)

class RegencyAdmin(ImportExportModelAdmin):
    list_display = ['unique_id', 'name']
    list_filter = ['province_id']
    autocomplete_fields = ['province_id']
    search_fields =  ['unique_id', 'name']
    ordering = ['unique_id']

admin.site.register(models.Regency, RegencyAdmin)

class DistrictAdmin(ImportExportModelAdmin):
    list_display = ['unique_id', 'name']
    list_filter = ['regency_id']
    autocomplete_fields = ['regency_id']
    search_fields =  ['unique_id', 'name']
    ordering = ['unique_id']

admin.site.register(models.District, DistrictAdmin)

class SubdistrictAdmin(ImportExportModelAdmin):
    list_display = ['unique_id', 'name']
    list_filter = ['district_id']
    autocomplete_field = ['district_id']
    search_fields =  ['unique_id', 'name']
    ordering = ['unique_id']

admin.site.register(models.Subdistrict, SubdistrictAdmin)

class PcrAntigenSwabAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'patient_id', 'category']
    autocomplete_fields = ['patient_id', 'medical_id', 'upload_by', 'hospital_id']
    list_filter = ['category']
    search_fields = ['patient_id__fullname', 'patient_id__email']
    ordering = ['-created_at']

admin.site.register(models.PcrAntigenSwab, PcrAntigenSwabAdmin)

class VitalSignAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'patient_id']
    autocomplete_fields = ['hospital_id', 'patient_id', 'medical_id', 'upload_by']
    list_filter = ['hospital_id']
    search_fields = ['patient_id__fullname', 'patient_id__email']
    ordering = ['-created_at']

admin.site.register(models.VitalSign, VitalSignAdmin)

# class MonitoringPatientAdmin(ImportExportModelAdmin):
#     list_display = ['created_at', 'patient_id', 'ews_score']
#     autocomplete_fields = ['patient_id', 'created_by', 'patient_room_allocation']
#     search_fields = ['patient_id__fullname', 'patient_id__email']
#     autocomplete_fields = ['medical_id', 'patient_id', 'created_by']
#     ordering = ['-created_at']

# admin.site.register(models.MonitoringPatient, MonitoringPatientAdmin)

class StatisticAdmin(ImportExportModelAdmin):
    list_display = ['created_at', 'type', 'room_allocation', 'total_bed', 'bed_occupied', 'day_of_stay', 'admitted', 'death']
    search_fields = ['type']
    ordering = ['-created_at']

admin.site.register(models.Statistic, StatisticAdmin)

class StandardBloodTestAdmin(ImportExportModelAdmin):
    list_display = ['type', 'upper_normal', 'lower_normal']
    search_fields = ['type']
    ordering = ['id']

admin.site.register(models.StandardBloodTest, StandardBloodTestAdmin)