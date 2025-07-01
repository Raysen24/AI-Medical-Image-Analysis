from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from account.models import CustomUser, Hospital, LoginActivity
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from . import models
from . import serializers
from rest_framework import status
import json
import requests
import datetime
from django.db.models import Q
from dateutil import relativedelta
from django.http import Http404
# Create your views here.


# APIView
class BedManagementCreateAPIView(APIView):
    def post(self, request):
        serializer = serializers.BedManagementCreate(data=request.data)
        if serializer.is_valid():
            room_id = serializer.data["room_id"]
            total_bed = serializer.data["total_bed"]
            room = models.Room.objects.filter(id=room_id).last()
            if room != None:
                for i in range(0, int(total_bed)):
                    lastBed = models.Bed.objects.filter(
                        room_id=room,
                        bed_number=i+1
                    ).last()
                    if lastBed == None:
                        models.Bed.objects.create(
                            room_id=room,
                            bed_number=i+1
                        )
            # serializer.save()
            # return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'status': 'success'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GraphLoginActivity(APIView):
    # permission_classes = [AllowAny]
    def get(self, request):
        today = datetime.date.today()
        respon = []
        date = []
        data = []

        for i in range(0, 7):
            hari = today - datetime.timedelta(days=i)
            date.append(hari)
            loginperhari = LoginActivity.objects.filter(created_at__date=hari).count()
            data.append(loginperhari)
            respon.append(
                {
                    'date': hari,
                    'data': loginperhari
                }
            )

        return Response(respon)

class Top3LocationThread:
    def __init__(self, location_name, count):
        self.location_name = location_name
        self.count = count

def locationCount(allig):
    return allig.count

class Top3Location(APIView):
    # permission_classes = [AllowAny]
    def get(self, request):
        data = []
        json_respon = []
        regencies = models.Regency.objects.all()
        for r in regencies:
            regency_user = CustomUser.objects.filter(regency__icontains=r.name).count()
            data.append(Top3LocationThread(r, regency_user))
    
        respon_data = sorted(data, key= locationCount, reverse=True)[:3]
        for rd in respon_data:
            location_name = rd.location_name
            location_count = rd.count
            json_respon.append(
                {
                    'location_name': location_name.name,
                    'location_count': location_count
                }
            )

        return Response(json_respon)

# class SettingByVitalSign(APIView):
#     # permission_classes = [AllowAny]
#     def get(self, request):
#         today = datetime.date.today()
#         respon = []

#         settingvsr =  models.Setting.objects.filter(
#                 Q(key='Standard 02 Saturation') |
#                 Q(key='Blood Pressure') |
#                 Q(key='Heart Rate') |
#                 Q(key='Respiratory Rate') |
#                 Q(key='Temperature')
#             ).order_by('created_at')

#         for i in settingvsr:
#             key = i.key
#             value = None
#             if i.value:
#                 value = int(i.value)

            

#         return Response(respon)


#JSON-API Data Administratif Indonesia
# api_indonesia = 'https://area.nyandev.id/'
api_indonesia = 'https://emsifa.github.io/api-wilayah-indonesia/api/'

class AllUserViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.AllUserSerializers
    queryset = models.CustomUser.objects.all().filter(is_active=True).order_by('-updated_at')

class ProvinceViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = serializers.ProvinceSerializers
    queryset = models.Province.objects.all().order_by('name')

    def get_queryset(self):
        self_table = models.Province.objects.all()
        if self_table.exists() == False:
            # provinces = requests.get(api_indonesia + 'provinsi.json')
            provinces = requests.get(api_indonesia + 'provinces.json')
            if provinces.status_code == 200:
                for i in provinces.json():
                    cek_id = self_table.filter(unique_id=i['id'])
                    if cek_id.exists() == False:
                        models.Province.objects.create(
                            unique_id=i['id'],
                            name=i['name']
                        )
        return models.Province.objects.all().order_by('name')

class RegencyViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = serializers.RegencySerializers
    queryset = models.Regency.objects.all().order_by('name')

    def get_queryset(self):
        idprovince = self.kwargs['idprovince']
        self_table = models.Regency.objects.all()
        # regency = requests.get(api_indonesia + 'provinsi/' + idprovince +'/kabupaten.json')
        regency = requests.get(api_indonesia + 'regencies/' + idprovince +'.json')
        if regency.status_code == 200:
            obj_province = models.Province.objects.filter(unique_id=idprovince)
            if obj_province.last() != None:
                for i in regency.json():
                    cek_id = self_table.filter(unique_id=i['id'])
                    if cek_id.exists() == False:
                        models.Regency.objects.create(
                            province_id=obj_province.last(),
                            unique_id=i['id'],
                            name=i['name']
                        )
        return models.Regency.objects.filter(province_id__unique_id=idprovince).order_by('name')

class DistrictViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = serializers.DistrictSerializers
    queryset = models.District.objects.all().order_by('name')
        
    def get_queryset(self):
        idregency = self.kwargs['idregency']
        self_table = models.District.objects.all()
        # district = requests.get(api_indonesia + 'provinsi/kabupaten/' + idregency +'/kecamatan.json')
        district = requests.get(api_indonesia + 'districts/' + idregency +'.json')
        if district.status_code == 200:
            obj_regency = models.Regency.objects.filter(unique_id=idregency)
            if obj_regency.last() != None:
                for i in district.json():
                    cek_id = self_table.filter(unique_id=i['id'])
                    if cek_id.exists() == False:
                        models.District.objects.create(
                            regency_id=obj_regency.last(),
                            unique_id=i['id'],
                            name=i['name']
                        )
        return models.District.objects.filter(regency_id__unique_id=idregency).order_by('name')

class SubdistrictViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = serializers.SubdistrictSerializers
    queryset = models.Subdistrict.objects.all().order_by('name')
        
    def get_queryset(self):
        iddistrict = self.kwargs['iddistrict']
        self_table = models.Subdistrict.objects.all()
        # subdistrict = requests.get(api_indonesia + 'provinsi/kabupaten/kecamatan/' + iddistrict +'/kelurahan.json')
        subdistrict = requests.get(api_indonesia + 'villages/' + iddistrict +'.json')
        if subdistrict.status_code == 200:
            obj_district = models.District.objects.filter(unique_id=iddistrict)
            if obj_district.last() != None:
                for i in subdistrict.json():
                    cek_id = self_table.filter(unique_id=i['id'])
                    if cek_id.exists() == False:
                        models.Subdistrict.objects.create(
                            district_id=obj_district.last(),
                            unique_id=i['id'],
                            name=i['name']
                        )
        return models.Subdistrict.objects.filter(district_id__unique_id=iddistrict).order_by('name')

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.AllUserSerializers
    queryset = CustomUser.objects.all()

    def get_queryset(self):
        return CustomUser.objects.all().filter(role='Patient')

class PatientByIdHospitalViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.AllUserSerializers
    queryset = CustomUser.objects.all()

    def get_queryset(self):
        idhospital = self.kwargs['idhospital']
        return CustomUser.objects.all().filter(
            role='Patient', hospital__id__in=idhospital
        )

class DoctorViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.AllUserSerializers
    queryset = CustomUser.objects.all().filter(role='Doctor').order_by('fullname')

    def get_queryset(self):
        return CustomUser.objects.all().filter(role='Doctor').order_by('fullname')

# class DoctorByIdHospitalViewSet(viewsets.ModelViewSet):
#     serializer_class = serializers.AllUserSerializers
#     queryset = CustomUser.objects.all().filter(role='Doctor').order_by('fullname')

#     def get_queryset(self):
#         # print(self.request.user)
#         idhospital = self.kwargs['idhospital']
#         return CustomUser.objects.filter(role='Doctor').filter(
#             hospital__id__in=idhospital
#         ).order_by('fullname')


class HospitalViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.HospitalSerializers
    queryset = Hospital.objects.all().order_by('name')

    def get_permissions(self):
        if self.action in ['list','retrieve']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(self.__class__, self).get_permissions()

class ActiveHospitalViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.HospitalSerializers
    queryset = Hospital.objects.all().order_by('name')

    def get_permissions(self):
        if self.action in ['list','retrieve']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAuthenticated]
        return super(self.__class__, self).get_permissions()

    def get_queryset(self):
        return Hospital.objects.filter(is_active=True).order_by('name')


class CXRViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CXRSerializers
    queryset = models.CXR.objects.all().order_by('-created_at')

    def get_queryset(self):
        if self.request.user.role == 'Hospital Admin':
            return models.CXR.objects.all().order_by('-created_at')
        elif self.request.user.role == 'Doctor' or self.request.user.role == 'Nurse':
            return models.CXR.objects.filter(
                hospital_id__in=self.request.user.hospital.all()
            ).order_by('-created_at')
        elif self.request.user.role == 'Patient':
            return models.CXR.objects.filter(
                patient_id=self.request.user
            ).order_by('-created_at')
        else:
            return models.CXR.objects.filter(
                upload_by=self.request.user
            ).order_by('-created_at')

class CXRDetailCompare(APIView):
    def get(self, request, pk, format=None):
        try:
            currentcxr = models.CXR.objects.get(pk=pk)
            cxrlast = models.CXR.objects.filter(
                medical_id=currentcxr.medical_id
            ).exclude(id=currentcxr.id).order_by('id')

            if cxrlast.last() != None:
                status = True
                snippet = models.CXR.objects.get(pk=cxrlast.last().id)
            else: 
                status = False
                snippet = models.CXR.objects.none()
            
            serializer = serializers.CXRSerializers(snippet, context={"request":request})
            resp = {
                    'status': status,
                    'data': serializer.data
                }
            return Response(resp)
        except models.CXR.DoesNotExist:
            raise Http404

class CTScanDetailCompare(APIView):
    def get(self, request, pk, format=None):
        try:
            currentctscan = models.CTScan.objects.get(pk=pk)
            ctscanlast = models.CTScan.objects.filter(
                medical_id=currentctscan.medical_id
            ).exclude(id=currentctscan.id).order_by('id')

            if ctscanlast.last() != None:
                status = True
                snippet = models.CTScan.objects.get(pk=ctscanlast.last().id)
            else: 
                status = False
                snippet = models.CTScan.objects.none()
        
            serializer = serializers.CTScanSerializers(snippet, context={"request":request})
            resp = {
                    'status': status,
                    'data': serializer.data
                }
            return Response(resp)
        except models.CTScan.DoesNotExist:
            raise Http404

class CXRByIdPatientViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CXRSerializers
    queryset = models.CXR.objects.all().order_by('-created_at')

    def get_queryset(self):
        idpatient = self.kwargs['idpatient']
        return models.CXR.objects.filter(patient_id__id=idpatient).order_by('-created_at')

class CTScanViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CTScanSerializers
    queryset = models.CTScan.objects.all().order_by('-created_at')

    def get_queryset(self):
        if self.request.user.role == 'Hospital Admin':
            return models.CTScan.objects.all().order_by('-created_at')
        elif self.request.user.role == 'Doctor' or self.request.user.role == 'Nurse':
            return models.CTScan.objects.filter(
                hospital_id__in=self.request.user.hospital.all()
            ).order_by('-created_at')
        elif self.request.user.role == 'Patient':
            return models.CTScan.objects.filter(
                patient_id=self.request.user
            ).order_by('-created_at')
        else:
            return models.CTScan.objects.filter(
                upload_by=self.request.user
            ).order_by('-created_at')

class CTScanByIdPatientViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.CTScanSerializers
    queryset = models.CTScan.objects.all().order_by('-created_at')

    def get_queryset(self):
        idpatient = self.kwargs['idpatient']
        return models.CTScan.objects.filter(patient_id__id=idpatient).order_by('-created_at')

class StandardBloodTestList(APIView):
    def get(self, request, format=None):
        snippets = models.StandardBloodTest.objects.all()
        serializer = serializers.StandardBloodTestSerializers(snippets, many=True)
        return Response(serializer.data)

class StandardBloodTestDetail(APIView):
    def get_object(self, type):
        try:
            return models.StandardBloodTest.objects.get(type=type)
        except models.StandardBloodTest.DoesNotExist:
            raise Http404

    def get(self, request, type, format=None):
        snippet = self.get_object(type)
        serializer = serializers.StandardBloodTestSerializers(snippet)
        return Response(serializer.data)

class BloodTestViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.BloodTestSerializers
    queryset = models.BloodTest.objects.all().order_by('-created_at')

    def get_queryset(self):
        start = self.request.GET.get('start')
        end = self.request.GET.get('end')
        
        if start != None and end != None:
            bloods = models.BloodTest.objects.filter(created_at__date__range=(start, end))
        else:
            bloods = models.BloodTest.objects.all()
        
        if self.request.user.role == 'Hospital Admin':
            return bloods.order_by('-created_at')
        elif self.request.user.role == 'Doctor' or self.request.user.role == 'Nurse':
            return bloods.filter(
                hospital_id__in=self.request.user.hospital.all()
            ).order_by('-created_at')
        elif self.request.user.role == 'Patient':
            return bloods.filter(
                patient_id=self.request.user
            ).order_by('-created_at')
        else:
            return bloods.order_by('-created_at')

class PcrAntigenSwabViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PcrAntigenSwabSerializers
    queryset = models.PcrAntigenSwab.objects.all().order_by('-created_at')

    def get_queryset(self):
        if self.request.user.role == 'Hospital Admin':
            return models.PcrAntigenSwab.objects.all().order_by('-created_at')
        elif self.request.user.role == 'Doctor' or self.request.user.role == 'Nurse':
            return models.PcrAntigenSwab.objects.filter(
                hospital_id__in=self.request.user.hospital.all()
            ).order_by('-created_at')
        elif self.request.user.role == 'Patient':
            return models.PcrAntigenSwab.objects.filter(
                patient_id=self.request.user
            ).order_by('-created_at')
        else:
            return models.PcrAntigenSwab.objects.filter(
                upload_by=self.request.user
            ).order_by('-created_at')

class PcrAntigenSwabByIdPatientViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PcrAntigenSwabSerializers
    queryset = models.PcrAntigenSwab.objects.all().order_by('-created_at')

    def get_queryset(self):
        idpatient = self.kwargs['idpatient']
        return models.PcrAntigenSwab.objects.filter(patient_id__id=idpatient).order_by('-created_at')

class BloodTestByIdPatientViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.BloodTestSerializers
    queryset = models.BloodTest.objects.all().order_by('-created_at')

    def get_queryset(self):
        idpatient = self.kwargs['idpatient']
        return models.BloodTest.objects.filter(patient_id__id=idpatient).order_by('-created_at')

class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.MedicalRecordSerializers
    queryset = models.MedicalRecord.objects.all().order_by('-created_at')

# class PatientByMedicalRecordDoctorViewSet(viewsets.ModelViewSet):
#     serializer_class = serializers.AllUserSerializers
#     queryset = CustomUser.objects.all().order_by('-created_at')

#     def get_queryset(self):
#         array_patient = []
#         distinct_patient = models.MedicalRecord.objects.filter(doctor_id=self.request.user).values_list('patient_id', flat=True).distinct()
#         for dp in distinct_patient:
#             array_patient.append(dp)
#         return CustomUser.objects.filter(id__in=array_patient)

# class MedicalRcordNotificationViewSet(viewsets.ModelViewSet):
#     serializer_class = serializers.MedicalRecordNotificationSerializers
#     queryset = models.MedicalRecordNotification.objects.all().order_by('-created_at')

# class MedicalRcordNotificationByidDoctorViewSet(viewsets.ModelViewSet):
#     serializer_class = serializers.MedicalRecordNotificationSerializers
#     queryset = models.MedicalRecordNotification.objects.all().order_by('-created_at')

#     def get_queryset(self):
#         iddoctor = self.kwargs['iddoctor']
#         return models.MedicalRecordNotification.objects.filter(
#             doctor_id=iddoctor,
#             is_read=False
#         ).order_by('created_at')

class MedicalRecordByIdPatientViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.MedicalRecordSerializers
    queryset = models.MedicalRecord.objects.all().order_by('-created_at')

    def get_queryset(self):
        idpatient = self.kwargs['idpatient']
        return models.MedicalRecord.objects.filter(patient_id__id=idpatient).order_by('-created_at')

class SoapViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.SoapSerializers
    queryset = models.Soap.objects.all().order_by('created_at')

# class SoapByIdPatientViewSet(viewsets.ModelViewSet):
#     serializer_class = serializers.SoapSerializers
#     queryset = models.Soap.objects.all().order_by('-created_at')

#     def get_queryset(self):
#         idpatient = self.kwargs['idpatient']
#         return models.Soap.objects.filter(patient_id__id=idpatient).order_by('-created_at')

class SoapByIdMedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.SoapSerializers
    queryset = models.Soap.objects.all().order_by('created_at')

    def get_queryset(self):
        idmedical = self.kwargs['idmedical']
        return models.Soap.objects.filter(medical_id__id=idmedical).order_by('created_at')



class HistoryActivityViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.HistoryActivitySerializers
    queryset = models.HistoryActivity.objects.all().order_by('-created_at')

    def get_queryset(self):
        return models.HistoryActivity.objects.filter(patient_id=self.request.user).order_by('-created_at')

class HistoryActivitySystemViewSet(viewsets.ModelViewSet): # ambil semua record
    serializer_class = serializers.HistoryActivitySerializers
    queryset = models.HistoryActivity.objects.all().order_by('-created_at')

    def get_queryset(self):
        return models.HistoryActivity.objects.all().order_by('-created_at')

# class MonitoringPatientViewSet(viewsets.ModelViewSet):
#     serializer_class = serializers.MonitoringPatientSerializers
#     queryset = models.MonitoringPatient.objects.all().order_by('-created_at')

class VitalSignViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.VitalSignSerializers
    queryset = models.VitalSign.objects.all().order_by('-created_at')

    def get_queryset(self):
        if self.request.user.role == 'Hospital Admin':
            return models.VitalSign.objects.all().order_by('-created_at')
        elif self.request.user.role == 'Doctor' or self.request.user.role == 'Nurse':
            return models.VitalSign.objects.filter(
                hospital_id__in=self.request.user.hospital.all()
            ).order_by('-created_at')
        elif self.request.user.role == 'Patient':
            return models.VitalSign.objects.filter(
                patient_id=self.request.user
            ).order_by('-created_at')
        else:
            return models.VitalSign.objects.filter(
                upload_by=self.request.user
            ).order_by('-created_at')

class GraphVitalSignViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.VitalSignSerializers
    queryset = models.VitalSign.objects.all().order_by('created_at')

    def get_queryset(self):
        if self.request.user.role == 'Hospital Admin':
            return models.VitalSign.objects.all().order_by('created_at')
        elif self.request.user.role == 'Doctor' or self.request.user.role == 'Nurse':
            return models.VitalSign.objects.filter(
                hospital_id__in=self.request.user.hospital.all()
            ).order_by('created_at')
        elif self.request.user.role == 'Patient':
            return models.VitalSign.objects.filter(
                patient_id=self.request.user
            ).order_by('created_at')
        else:
            return models.VitalSign.objects.filter(
                upload_by=self.request.user
            ).order_by('-created_at')

class OtherNoteViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.OtherNoteSerializers
    queryset = models.OtherNote.objects.all().order_by('-created_at')

    def get_queryset(self):
        if self.request.user.role == 'Hospital Admin':
            return models.OtherNote.objects.all().order_by('-created_at')
        elif self.request.user.role == 'Doctor' or self.request.user.role == 'Nurse':
            return models.OtherNote.objects.filter(
                hospital_id__in=self.request.user.hospital.all()
            ).order_by('-created_at')
        elif self.request.user.role == 'Patient':
            return models.OtherNote.objects.filter(
                patient_id=self.request.user
            ).order_by('-created_at')
        else:
            return models.OtherNote.objects.filter(
                upload_by=self.request.user
            ).order_by('-created_at')


# class MonitoringPatientByIdPatientViewSet(viewsets.ModelViewSet):
#     serializer_class = serializers.MonitoringPatientSerializers
#     queryset = models.MonitoringPatient.objects.all().order_by('-created_at')

#     def get_queryset(self):
#         idpatient = self.kwargs['idpatient']
#         return models.MonitoringPatient.objects.filter(patient_id__id=idpatient).order_by('-created_at')

class LoginActivityViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.LoginActivitySerializers
    queryset = LoginActivity.objects.all()

class BuildingHospitalViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.BuildingHospitalSerializers
    queryset = models.BuildingHospital.objects.all()

class BuildingHospitalByIdHospitalViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = serializers.BuildingHospitalSerializers
    queryset = models.BuildingHospital.objects.all()

    def get_queryset(self):
        idhospital = self.kwargs['idhospital']
        return models.BuildingHospital.objects.filter(hospital_id__id=idhospital).order_by('name')

class BedViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.BedSerializers
    queryset = models.Bed.objects.all().order_by('room_id__room_name', 'bed_number')

class BedByIdRoomViewSet(viewsets.ModelViewSet):
    # permission_classes = [AllowAny]
    serializer_class = serializers.BedSerializers
    queryset = models.Bed.objects.all()

    def get_queryset(self):
        idroom = self.kwargs['idroom']
        return models.Bed.objects.filter(
            room_id__id=idroom,
            is_occupied=False
        ).order_by('bed_number')

class BedByIdRoomVisibleIdBedViewSet(viewsets.ModelViewSet):
    # permission_classes = [AllowAny]
    serializer_class = serializers.BedSerializers
    queryset = models.Bed.objects.all()

    def get_queryset(self):
        idroom = self.kwargs['idroom']
        idbed = self.kwargs['idbed']
        idBeds = []
        bedAvailable = models.Bed.objects.filter(
            room_id__id=idroom,
            is_occupied=False
        ).order_by('bed_number')
        idBeds.append(int(idbed))
        for i in bedAvailable:
            idBeds.append(i.id)
        return models.Bed.objects.filter(
            id__in=idBeds
        ).order_by('bed_number')

class RoomViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RoomSerializers
    queryset = models.Room.objects.all().order_by('room_name', 'room_number')

class RoomByIdBuildingViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RoomSerializers
    queryset = models.Room.objects.all().order_by('room_name', 'room_number')

    def get_queryset(self):
        idbuilding = self.kwargs['idbuilding']
        return models.Room.objects.filter(building_id__id=idbuilding).order_by('room_name', 'room_number')

class RoomByIdHospitalViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RoomSerializers
    queryset = models.Room.objects.all().order_by('room_name', 'room_number')

    def get_queryset(self):
        idhospital = self.kwargs['idhospital']
        return models.Room.objects.filter(hospital_id__id=idhospital).order_by('room_name')

class RoomByIdHospitalAndStatusPatientViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RoomSerializers
    queryset = models.Room.objects.all().order_by('room_name', 'room_number')

    def get_queryset(self):
        idhospital = self.kwargs['idhospital']
        statuspatient = self.kwargs['statuspatient']

        if statuspatient == 'Outpatient':
            return models.Room.objects.filter(
                hospital_id__id=idhospital,
                room_name__icontains='poliklinik',
                is_active=True
            ).order_by('room_name')
        else:
            return models.Room.objects.filter(
                hospital_id__id=idhospital,
                is_active=True
            ).order_by('room_name')

class SettingViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.SettingSerializers
    queryset = models.Setting.objects.all()

class SettingByStandardVitalSignViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.SettingSerializers
    queryset = models.Setting.objects.all()

    def get_queryset(self):
        return models.Setting.objects.filter(
            Q(key='Standard O2 Saturation') |
            Q(key='Standard Blood Pressure') |
            Q(key='Standard Heart Rate') |
            Q(key='Standard Respiratory Rate') |
            Q(key='Standard Temperature')
        ).order_by('-created_at')


class ImportBloodTestByPatientAPIView(APIView):
    def post(self, request, format=None):
        resp = []
        array = request.data
        for i in array:
            basofil=i['basofil']
            cl=95
            creat=i['creat']
            eos=i['eos']
            eri=i['eri']
            gsdfull=i['gsdfull']
            hb=i['hb']
            hct=i['hct']
            k=3.5
            leko=i['leko']
            limfosit=i['limfosit']
            mch=i['mch']
            mchc=i['mchc']
            mcv=i['mcv']
            monosit=i['monosit']
            na=135
            neutb=i['neutb']
            nlr1=i['nlr1']
            plt=i['plt']
            rdw=i['rdw']
            segmen=i['segmen']
            sgot=i['sgot']
            sgpt=i['sgpt']
            ureum=i['ureum']
            led=i['led']
            bildirek=0
            bilindir=0.1
            biltot=0
            hco3_n=22
            o2s_n=i['o2s_n']
            pco2_n=33
            ph_nu=7.37
            po2_n=i['po2_n']
            tco2_n=23
            ptinr=93
            bjurin=0
            phurin=0
            choles=0
            gdpfull=0
            gdppfull=0
            hdlcho=0
            ldlcho=0
            trigl=0
            ua=0
            tshsnew=0
            albcp=0
            tp=0
            t4=0
            mg=0
            caltot=0
            glurapid=0
            hdld=0
            alp=0
            ggt=0
            glob=0
            ldh=i['ldh']
            ft4=0
            lakt_dr=0
            acp001=0
            acp002=0
            acp009=0
            cglu=0
            cldh=0
            cprot=0
            sglu=0
            sldh=0
            sprot=0
            aca001=0
            aca002=0
            aca009=0
            cglua=0
            cldha=0
            cprota=0
            sglua=0
            sldha=0
            sprota=0
            tgl_lahir=i['tgl_lahir']
            hospital = None
            if self.request.user.hospital.all():
                hospital = self.request.user.hospital.all()[0]

            cek_patient = CustomUser.objects.filter(id=self.request.user.id).exists()
            lastMedical = models.MedicalRecord.objects.filter(
                patient_id=self.request.user
            ).last()
            if cek_patient == True:
                
                bloodtest = models.BloodTest.objects.create(
                    basofil=basofil, cl=cl, creat=creat, eos=eos, eri=eri, gsdfull=gsdfull, hb=hb,
                    hct=hct, k=k, leko=leko, limfosit=limfosit, mch=mch, mchc=mchc, mcv=mcv,
                    monosit=monosit, na=na, neutb=neutb, nlr1=nlr1, plt=plt, rdw=rdw, segmen=segmen, 
                    sgot=sgot, sgpt=sgpt, ureum=ureum, led=led, bildirek=bildirek, bilindir=bilindir, biltot=biltot, hco3_n=hco3_n,
                    o2s_n=o2s_n, pco2_n=pco2_n, ph_nu=ph_nu, po2_n=po2_n, tco2_n=tco2_n, ptinr=ptinr,
                    bjurin=bjurin, phurin=phurin, choles=choles, gdpfull=gdpfull, gdppfull=gdppfull, hdlcho=hdlcho, ldlcho=ldlcho,
                    trigl=trigl, ua=ua, tshsnew=tshsnew, albcp=albcp, tp=tp, t4=t4,
                    caltot=caltot, mg=mg, glurapid=glurapid, hdld=hdld, alp=alp, ggt=ggt, glob=glob,
                    ldh=ldh, ft4=ft4, lakt_dr=lakt_dr, acp001=acp001, acp002=acp002, acp009=acp009,
                    cglu=cglu, cldh=cldh, cprot=cprot, sglu=sglu, sldh=sldh, sprot=sprot,
                    aca001=aca001, aca002=aca002, aca009=aca009, cglua=cglua, cldha=cldha, cprota=cprota,
                    sglua=sglua, sldha=sldha, sprota=sprota, tgl_lahir=tgl_lahir,
                    upload_by=self.request.user,
                    patient_id=self.request.user,
                    medical_id=lastMedical,
                    hospital_id=hospital
                )
                myobj = {
                    "data": {
                        "BASOFIL_RESULT_VALUE": basofil,
                        "CL_RESULT_VALUE": cl,
                        "CREAT_RESULT_VALUE": creat,
                        "EOS_RESULT_VALUE": eos,
                        "ERI_RESULT_VALUE": eri,
                        "GDSFULL_RESULT_VALUE": gsdfull,
                        "HB_RESULT_VALUE": hb,
                        "HCT_RESULT_VALUE": hct,
                        "K_RESULT_VALUE": k,
                        "LEKO_RESULT_VALUE": leko,
                        "LIMFOSIT_RESULT_VALUE": limfosit,
                        "MCH_RESULT_VALUE": mch,
                        "MCHC_RESULT_VALUE": mchc,
                        "MCV_RESULT_VALUE": mcv,
                        "MONOSIT_RESULT_VALUE": monosit,
                        "NA_RESULT_VALUE": na,
                        "NEUTB_RESULT_VALUE": neutb,
                        "NLR1_RESULT_VALUE": nlr1,
                        "PLT_RESULT_VALUE": plt,
                        "RDW_RESULT_VALUE": rdw,
                        "SEGMEN_RESULT_VALUE": segmen,
                        "SGOT_RESULT_VALUE": sgot,
                        "SGPT_RESULT_VALUE": sgpt,
                        "UREUM_RESULT_VALUE": ureum,
                        "LED_RESULT_VALUE": led,
                        "BILDIREK_RESULT_VALUE": bildirek,
                        "BILINDIR_RESULT_VALUE": bilindir,
                        "BILTOT_RESULT_VALUE": biltot,
                        "HCO3_N_RESULT_VALUE": hco3_n,
                        "O2S_N_RESULT_VALUE": o2s_n,
                        "PCO2_N_RESULT_VALUE": pco2_n,
                        "PH_NU_RESULT_VALUE": ph_nu,
                        "PO2_N_RESULT_VALUE": po2_n,
                        "TCO2_N_RESULT_VALUE": tco2_n,
                        "PTINR_RESULT_VALUE": ptinr,
                        "BJURIN_RESULT_VALUE": bjurin,
                        "PHURIN_RESULT_VALUE": phurin,
                        "CHOLES_RESULT_VALUE": choles,
                        "GDPFULL_RESULT_VALUE": gdpfull,
                        "GDPPFULL_RESULT_VALUE": gdppfull,
                        "HDLCHO_RESULT_VALUE": hdlcho,
                        "LDLCHO_RESULT_VALUE": ldlcho,
                        "TRIGL_RESULT_VALUE": trigl,
                        "UA_RESULT_VALUE": ua,
                        "TSHSNEW_RESULT_VALUE": tshsnew,
                        "ALBCP_RESULT_VALUE": albcp,
                        "TP_RESULT_VALUE": tp,
                        "T4 TOTAL_RESULT_VALUE": t4,
                        "CALTOT_RESULT_VALUE": caltot,
                        "MG_RESULT_VALUE": mg,
                        "GLURAPID_RESULT_VALUE": glurapid,
                        "HDLD_RESULT_VALUE": hdld,
                        "ALP_RESULT_VALUE": alp,
                        "GGT_RESULT_VALUE": ggt,
                        "GLOB_RESULT_VALUE": glob,
                        "LDH_RESULT_VALUE": ldh,
                        "FT4_RESULT_VALUE": ft4,
                        "LAKT_DR_RESULT_VALUE": lakt_dr,
                        "ACP001_RESULT_VALUE": acp001,
                        "ACP002_RESULT_VALUE": acp002,
                        "ACP009_RESULT_VALUE": acp009,
                        "CGLU_RESULT_VALUE": cglu,
                        "CLDH_RESULT_VALUE": cldh,
                        "CPROT_RESULT_VALUE": cprot,
                        "SGLU_RESULT_VALUE": sglu,
                        "SLDH_RESULT_VALUE": sldh,
                        "SPROT_RESULT_VALUE": sprot,
                        "ACA001_RESULT_VALUE": aca001,
                        "ACA002_RESULT_VALUE": aca002,
                        "ACA009_RESULT_VALUE": aca009,
                        "CGLUA_RESULT_VALUE": cglua,
                        "CLDHA_RESULT_VALUE": cldha,
                        "CPROTA_RESULT_VALUE": cprota,
                        "SGLUA_RESULT_VALUE": sglua,
                        "SLDHA_RESULT_VALUE": sldha,
                        "SPROTA_RESULT_VALUE": sprota,
                        "TGL_LAHIR": tgl_lahir
                    }
                }
                header = {
                    'Content-Type': 'application/json', 
                }

                x = requests.post(
                    serializers.url_blooadtest,
                    json=myobj,
                    headers=header
                )

                respNumed = json.loads(x.text)
                # print('ADDD')
                # print(i)
                # print(respNumed)
                if respNumed['status'] == 'success':
                    bloodtest.probapredict = respNumed['probapredict']
                    bloodtest.classpredict = respNumed['classpredict']
                    bloodtest.save()
                # else:
                #     bloodtest.delete()

                resp.append({
                    'email_user': self.request.user.email,
                    'status': 'Success'
                })
            else:
                resp.append({
                    'status': 'Failed'
                })

        return Response(resp)

class ImportBloodTestByNurseAPIView(APIView):
    def post(self, request, format=None):
        resp = []
        array = request.data
        for i in array:
            mr_id_patient = i['mr_id']
            basofil=i['basofil']
            cl=95
            creat=i['creat']
            eos=i['eos']
            eri=i['eri']
            gsdfull=i['gsdfull']
            hb=i['hb']
            hct=i['hct']
            k=3.5
            leko=i['leko']
            limfosit=i['limfosit']
            mch=i['mch']
            mchc=i['mchc']
            mcv=i['mcv']
            monosit=i['monosit']
            na=135
            neutb=i['neutb']
            nlr1=i['nlr1']
            plt=i['plt']
            rdw=i['rdw']
            segmen=i['segmen']
            sgot=i['sgot']
            sgpt=i['sgpt']
            ureum=i['ureum']
            led=i['led']
            bildirek=0
            bilindir=0.1
            biltot=0
            hco3_n=22
            o2s_n=i['o2s_n']
            pco2_n=33
            ph_nu=7.37
            po2_n=i['po2_n']
            tco2_n=23
            ptinr=93
            bjurin=0
            phurin=0
            choles=0
            gdpfull=0
            gdppfull=0
            hdlcho=0
            ldlcho=0
            trigl=0
            ua=0
            tshsnew=0
            albcp=0
            tp=0
            t4=0
            mg=0
            caltot=0
            glurapid=0
            hdld=0
            alp=0
            ggt=0
            glob=0
            ldh=i['ldh']
            ft4=0
            lakt_dr=0
            acp001=0
            acp002=0
            acp009=0
            cglu=0
            cldh=0
            cprot=0
            sglu=0
            sldh=0
            sprot=0
            aca001=0
            aca002=0
            aca009=0
            cglua=0
            cldha=0
            cprota=0
            sglua=0
            sldha=0
            sprota=0
            tgl_lahir=i['tgl_lahir']
            hospital = None
            if self.request.user.hospital.all():
                hospital = self.request.user.hospital.all()[0]
            
            patient = CustomUser.objects.filter(mr_id_patient=mr_id_patient)
            lastMedical = models.MedicalRecord.objects.filter(
                patient_id=patient.last()
            ).last()
            # print('PATIENT', patient)
            if patient.exists():
                bloodtest = models.BloodTest.objects.create(
                    basofil=basofil, cl=cl, creat=creat, eos=eos, eri=eri, gsdfull=gsdfull, hb=hb,
                    hct=hct, k=k, leko=leko, limfosit=limfosit, mch=mch, mchc=mchc, mcv=mcv,
                    monosit=monosit, na=na, neutb=neutb, nlr1=nlr1, plt=plt, rdw=rdw, segmen=segmen, 
                    sgot=sgot, sgpt=sgpt, ureum=ureum, led=led, bildirek=bildirek, bilindir=bilindir, biltot=biltot, hco3_n=hco3_n,
                    o2s_n=o2s_n, pco2_n=pco2_n, ph_nu=ph_nu, po2_n=po2_n, tco2_n=tco2_n, ptinr=ptinr,
                    bjurin=bjurin, phurin=phurin, choles=choles, gdpfull=gdpfull, gdppfull=gdppfull, hdlcho=hdlcho, ldlcho=ldlcho,
                    trigl=trigl, ua=ua, tshsnew=tshsnew, albcp=albcp, tp=tp, t4=t4,
                    caltot=caltot, mg=mg, glurapid=glurapid, hdld=hdld, alp=alp, ggt=ggt, glob=glob,
                    ldh=ldh, ft4=ft4, lakt_dr=lakt_dr, acp001=acp001, acp002=acp002, acp009=acp009,
                    cglu=cglu, cldh=cldh, cprot=cprot, sglu=sglu, sldh=sldh, sprot=sprot,
                    aca001=aca001, aca002=aca002, aca009=aca009, cglua=cglua, cldha=cldha, cprota=cprota,
                    sglua=sglua, sldha=sldha, sprota=sprota, tgl_lahir=tgl_lahir,
                    upload_by=self.request.user,
                    patient_id=patient.last(),
                    medical_id=lastMedical,
                    hospital_id=hospital
                )
                # print('bloodtest', bloodtest)
                myobj = {
                    "data": {
                        "BASOFIL_RESULT_VALUE": basofil,
                        "CL_RESULT_VALUE": cl,
                        "CREAT_RESULT_VALUE": creat,
                        "EOS_RESULT_VALUE": eos,
                        "ERI_RESULT_VALUE": eri,
                        "GDSFULL_RESULT_VALUE": gsdfull,
                        "HB_RESULT_VALUE": hb,
                        "HCT_RESULT_VALUE": hct,
                        "K_RESULT_VALUE": k,
                        "LEKO_RESULT_VALUE": leko,
                        "LIMFOSIT_RESULT_VALUE": limfosit,
                        "MCH_RESULT_VALUE": mch,
                        "MCHC_RESULT_VALUE": mchc,
                        "MCV_RESULT_VALUE": mcv,
                        "MONOSIT_RESULT_VALUE": monosit,
                        "NA_RESULT_VALUE": na,
                        "NEUTB_RESULT_VALUE": neutb,
                        "NLR1_RESULT_VALUE": nlr1,
                        "PLT_RESULT_VALUE": plt,
                        "RDW_RESULT_VALUE": rdw,
                        "SEGMEN_RESULT_VALUE": segmen,
                        "SGOT_RESULT_VALUE": sgot,
                        "SGPT_RESULT_VALUE": sgpt,
                        "UREUM_RESULT_VALUE": ureum,
                        "LED_RESULT_VALUE": led,
                        "BILDIREK_RESULT_VALUE": bildirek,
                        "BILINDIR_RESULT_VALUE": bilindir,
                        "BILTOT_RESULT_VALUE": biltot,
                        "HCO3_N_RESULT_VALUE": hco3_n,
                        "O2S_N_RESULT_VALUE": o2s_n,
                        "PCO2_N_RESULT_VALUE": pco2_n,
                        "PH_NU_RESULT_VALUE": ph_nu,
                        "PO2_N_RESULT_VALUE": po2_n,
                        "TCO2_N_RESULT_VALUE": tco2_n,
                        "PTINR_RESULT_VALUE": ptinr,
                        "BJURIN_RESULT_VALUE": bjurin,
                        "PHURIN_RESULT_VALUE": phurin,
                        "CHOLES_RESULT_VALUE": choles,
                        "GDPFULL_RESULT_VALUE": gdpfull,
                        "GDPPFULL_RESULT_VALUE": gdppfull,
                        "HDLCHO_RESULT_VALUE": hdlcho,
                        "LDLCHO_RESULT_VALUE": ldlcho,
                        "TRIGL_RESULT_VALUE": trigl,
                        "UA_RESULT_VALUE": ua,
                        "TSHSNEW_RESULT_VALUE": tshsnew,
                        "ALBCP_RESULT_VALUE": albcp,
                        "TP_RESULT_VALUE": tp,
                        "T4 TOTAL_RESULT_VALUE": t4,
                        "CALTOT_RESULT_VALUE": caltot,
                        "MG_RESULT_VALUE": mg,
                        "GLURAPID_RESULT_VALUE": glurapid,
                        "HDLD_RESULT_VALUE": hdld,
                        "ALP_RESULT_VALUE": alp,
                        "GGT_RESULT_VALUE": ggt,
                        "GLOB_RESULT_VALUE": glob,
                        "LDH_RESULT_VALUE": ldh,
                        "FT4_RESULT_VALUE": ft4,
                        "LAKT_DR_RESULT_VALUE": lakt_dr,
                        "ACP001_RESULT_VALUE": acp001,
                        "ACP002_RESULT_VALUE": acp002,
                        "ACP009_RESULT_VALUE": acp009,
                        "CGLU_RESULT_VALUE": cglu,
                        "CLDH_RESULT_VALUE": cldh,
                        "CPROT_RESULT_VALUE": cprot,
                        "SGLU_RESULT_VALUE": sglu,
                        "SLDH_RESULT_VALUE": sldh,
                        "SPROT_RESULT_VALUE": sprot,
                        "ACA001_RESULT_VALUE": aca001,
                        "ACA002_RESULT_VALUE": aca002,
                        "ACA009_RESULT_VALUE": aca009,
                        "CGLUA_RESULT_VALUE": cglua,
                        "CLDHA_RESULT_VALUE": cldha,
                        "CPROTA_RESULT_VALUE": cprota,
                        "SGLUA_RESULT_VALUE": sglua,
                        "SLDHA_RESULT_VALUE": sldha,
                        "SPROTA_RESULT_VALUE": sprota,
                        "TGL_LAHIR": tgl_lahir
                    }
                }
                header = {
                    'Content-Type': 'application/json', 
                }

                x = requests.post(
                    serializers.url_blooadtest,
                    json=myobj,
                    headers=header
                )

                respNumed = json.loads(x.text)
                # print(respNumed)
                if respNumed['status'] == 'success':
                    bloodtest.probapredict = respNumed['probapredict']
                    bloodtest.classpredict = respNumed['classpredict']
                    bloodtest.save()
            else:
                resp.append({
                    'status': 'Failed'
                })

        return Response(resp)

class StatisticBedCapacityPlanningAPIView(APIView):
    def get(self, request, format=None):
        year = self.request.GET.get('year', str(datetime.date.today().year))
        rooms = []
        beds = []
        stats = models.Statistic.objects.filter(
            created_at__year=year,
            type='Bed Capacity Planning'
        )
        for i in range(1, 13):
            month_name = datetime.date.today().replace(day=1).replace(month=i).strftime('%B')
            last_stats_month = stats.filter(
                created_at__month=i
            ).last()
            if last_stats_month != None:
                room_allocation = last_stats_month.room_allocation
                bed_occupied = last_stats_month.bed_occupied
            else:
                room_allocation = 0
                bed_occupied = 0
            
            rooms.append({
                'x': month_name,
                'y': room_allocation,
            })

            beds.append({
                'x': month_name,
                'y': bed_occupied,
            })
        
        resp = ({
                'room_allocation': rooms,
                'bed_occupied': beds
            })
        
        return Response(resp)

class StatisticInPatientLengthStayAPIView(APIView):
    def get(self, request, format=None):
        year = self.request.GET.get('year', str(datetime.date.today().year))

        lengthStay = []

        startDateYear = ((datetime.date.today().replace(day=1)).replace(month=1)).replace(year=int(year))
        firstDateNextYear = startDateYear + relativedelta.relativedelta(months=12)
        endDateYear = firstDateNextYear - datetime.timedelta(days=1)
        # print(startDateYear, endDateYear)
        stats = models.Statistic.objects.filter(
            created_at__date__range=(startDateYear, endDateYear),
            type='Inpatient Length of Stay'
        )

        pekanYear = 120 / 7

        # people_stay = 0
        for i in range(1, round(pekanYear) +1):
            labelWeek = 'Week ' + str(i)
            end = i * 7
            start = end - 6
            people_stay = stats.filter(
                day_of_stay__gte=start,  day_of_stay__lte=end
            ).count()

            if start == 113:
                labelWeek = 'Week >' + str(i-1)
                people_stay = stats.filter(
                    day_of_stay__gte=start
                ).count()

            lengthStay.append({
                # 'xi': str(start) + '-' + str(end),
                'x': labelWeek,
                'y': people_stay,
            })

        resp = {
            'year': year,
            'lengthStay': lengthStay
        }        
        return Response(resp)

class StatisticInPatientSummaryAPIView(APIView):
    def get(self, request, format=None):
        year = self.request.GET.get('year', str(datetime.date.today().year))
        admitted = []
        death = []
        stats = models.Statistic.objects.filter(
            created_at__year=year,
            type='Inpatient Summary'
        )

        for i in range(1, 13):
            admittedCount = 0
            deathCount = 0

            month_name = datetime.date.today().replace(day=1).replace(month=i).strftime('%B')
            the_day = datetime.date.today().replace(day=1).replace(month=i)
            startDateMonth = the_day.replace(day=1)
            firstDateNextMonth = (the_day.replace(day=1)) + relativedelta.relativedelta(months=1)
            endDateMonth = firstDateNextMonth - datetime.timedelta(days=1)
            # print('endDate', startDateMonth, endDateMonth)

            last_admitted_month = stats.filter(
                created_at__date__range=(startDateMonth, endDateMonth),
            ).exclude(admitted=None).order_by('created_at').last()
            if last_admitted_month != None:
                admittedCount = last_admitted_month.admitted

            last_death_month = stats.filter(
                created_at__date__range=(startDateMonth, endDateMonth),
            ).exclude(death=None).order_by('created_at').last()
            if last_death_month != None:
                deathCount = last_death_month.death
            
            admitted.append({
                'x': month_name,
                'y': admittedCount,
            })

            death.append({
                'x': month_name,
                'y': deathCount,
            })
        
        resp = ({
            'year': year,
            'admitted': admitted,
            'death': death
        })
        
        return Response(resp)
        
class SynchronizeIot(APIView):
    def get(self, request):
        idpatient = self.request.GET.get('idpatient', None)
        numed_auth = requests.get(
            'https://ec2-108-136-227-7.ap-southeast-3.compute.amazonaws.com/api/v1/iot/token',
            auth=('a@a.com','byornexpert')
        )
        average_respitarory_rate = 0
        average_02_saturation = 0
        average_temp = 0
        if numed_auth.status_code == 200:
            res1 = json.loads(numed_auth.text)
            measurement = requests.get(
                'https://ec2-108-136-227-7.ap-southeast-3.compute.amazonaws.com/api/v1/iot/data/type',
                    headers={'Authorization': 'Bearer ' + res1['auth_token']}
                )
            if measurement.status_code == 200:
                res2 = json.loads(measurement.text)
                if res2['status'] == True:
                    for a in res2['data']:
                        if a != 'temperature':
                            measurement_id = requests.get(
                                'https://ec2-108-136-227-7.ap-southeast-3.compute.amazonaws.com/api/v1/iot/data/type/' + a + '/id',
                                    headers={'Authorization': 'Bearer ' + res1['auth_token']}
                                )
                            if measurement_id.status_code == 200:
                                res3 = json.loads(measurement_id.text)
                                if res3['status'] == True:
                                    measurement_bulk = requests.get(
                                    'https://ec2-108-136-227-7.ap-southeast-3.compute.amazonaws.com/api/v1/iot/data/bulkdownload/' +res3['data'][-1],
                                        headers={'Authorization': 'Bearer ' + res1['auth_token']}
                                    )
                                    total_respiratory_rate = 0
                                    total_O2_saturation = 0
                                    total_temp = 0
                                    if measurement_bulk.status_code == 200:
                                        res4 = json.loads(measurement_bulk.text)
                                        for resprate in res4['data']['respiratory_rate']['data']:
                                            total_respiratory_rate = total_respiratory_rate + resprate
                                        average_respitarory_rate = total_respiratory_rate / len(res4['data']['respiratory_rate']['data'])

                                        for o2_staturation in res4['data']['O2_saturation']['data']:
                                            total_O2_saturation = total_O2_saturation + o2_staturation
                                        average_02_saturation = total_O2_saturation / len(res4['data']['O2_saturation']['data'])

                                        for temp in res4['data']['temp']['data']:
                                            total_temp = total_temp + temp
                                        average_temp = total_temp / len(res4['data']['temp']['data'])
                                        # print('average', average_respitarory_rate)
                                        # print('average1', average_02_saturation)
                                        # print('average2', average_temp)

        patient = CustomUser.objects.filter(id=idpatient).last()
        lastMedical = models.MedicalRecord.objects.filter(
            patient_id__id=idpatient
        ).last()
        hospital = None
        if lastMedical != None:
            hospital = lastMedical.hospital_id
        created = models.VitalSign.objects.create(
            respirotary_rate=average_respitarory_rate,
            temperature=average_temp,
            saturate=average_02_saturation,
            upload_by=self.request.user,
            patient_id=patient,
            medical_id=lastMedical,
            hospital_id=hospital,
            blood_pressure=101,
            heart_rate=41,
            oxy_aid='None'
        )
        serializer = serializers.VitalSignSerializers(created)
        return Response(serializer.data)

# # provinces = requests.get(api_indonesia + 'provinsi.json')
#             provinces = requests.get(api_indonesia + 'provinces.json')
#             if provinces.status_code == 200:
