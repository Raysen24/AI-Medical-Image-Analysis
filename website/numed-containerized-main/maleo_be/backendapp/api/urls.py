from multiprocessing import synchronize
from django.urls import path, include
from rest_framework import routers, urlpatterns
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
# Swagger documentation setup
schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        contact=openapi.Contact(email="maleotechnologies@gmail.com"),
        license=openapi.License(name="MALEOTECH License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)
router = DefaultRouter()
router.register('alluser', views.AllUserViewSet)
router.register('loginactivity', views.LoginActivityViewSet)
router.register('hospital', views.HospitalViewSet)
router.register('pcrantigenswab', views.PcrAntigenSwabViewSet)
router.register('cxr', views.CXRViewSet)
router.register('ctscan', views.CTScanViewSet)
router.register('bloodtest', views.BloodTestViewSet)
router.register('medicalrecord', views.MedicalRecordViewSet)
router.register('soap', views.SoapViewSet)
router.register('othernote', views.OtherNoteViewSet)
# router.register('medicalrecordnotification', views.MedicalRcordNotificationViewSet)
router.register('patient', views.PatientViewSet)
router.register('doctor', views.DoctorViewSet)
router.register('historyactivity', views.HistoryActivityViewSet)
router.register('historyactivitysystem', views.HistoryActivitySystemViewSet)
# router.register('monitoringpatient', views.MonitoringPatientViewSet)
# router.register('patientdoctor', views.PatientByMedicalRecordDoctorViewSet)
router.register('room', views.RoomViewSet)
router.register('vitalsign', views.VitalSignViewSet)
router.register('setting', views.SettingViewSet)
router.register('buildinghospital', views.BuildingHospitalViewSet)
router.register('bed', views.BedViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("activehospital/", views.ActiveHospitalViewSet.as_view({'get': 'list'})),
    path('bed-create/', views.BedManagementCreateAPIView.as_view()), 
    path('buildingbyidhospital/<idhospital>/', views.BuildingHospitalByIdHospitalViewSet.as_view({'get': 'list'})),
    path('roombyidbuilding/<idbuilding>/', views.RoomByIdBuildingViewSet.as_view({'get': 'list'})),
    path('bedbyidroom/<idroom>/', views.BedByIdRoomViewSet.as_view({'get': 'list'})),
    path('bedbyidroom/<idroom>/visibleidbed/<idbed>/', views.BedByIdRoomVisibleIdBedViewSet.as_view({'get': 'list'})), #berfungsi untuk edit medical record
    path("graphVvitalsign/", views.GraphVitalSignViewSet.as_view({'get': 'list'})),
    # path('doctorbyidhospital/<idhospital>/', views.DoctorByIdHospitalViewSet.as_view({'get':'list'})),

    path('province/', views.ProvinceViewSet.as_view({'get': 'list'})),
    path('province/<idprovince>/regency/', views.RegencyViewSet.as_view({'get': 'list'})),
    path('province/regency/<idregency>/district/', views.DistrictViewSet.as_view({'get': 'list'})),
    path('province/regency/district/<iddistrict>/subdistrict/', views.SubdistrictViewSet.as_view({'get': 'list'})),

    path('settingbyvitalsign/', views.SettingByStandardVitalSignViewSet.as_view({'get': 'list'})),
    
    path('cxrbyidpatient/<idpatient>/', views.CXRByIdPatientViewSet.as_view({'get': 'list'})),
    path('ctscanbyidpatient/<idpatient>/', views.CTScanByIdPatientViewSet.as_view({'get': 'list'})),
    path('cxrdetailcompare/<pk>/', views.CXRDetailCompare.as_view()),
    path('ctscandetailcompare/<pk>/', views.CTScanDetailCompare.as_view()),
    path('bloodtestbyidpatient/<idpatient>/', views.BloodTestByIdPatientViewSet.as_view({'get': 'list'})),
    path('pcrantigenswabbyidpatient/<idpatient>/', views.PcrAntigenSwabByIdPatientViewSet.as_view({'get': 'list'})),
    # path('monitoringpatientbyidpatient/<idpatient>/', views.MonitoringPatientByIdPatientViewSet.as_view({'get': 'list'})),
    path('medicalrecordbyidpatient/<int:idpatient>/', views.MedicalRecordByIdPatientViewSet.as_view({'get': 'list'})),
    # path('soapbyidpatient/<idpatient>/', views.SoapByIdPatientViewSet.as_view({'get': 'list'})),
    path('soapbyidmedical/<idmedical>/', views.SoapByIdMedicalRecordViewSet.as_view({'get': 'list'})),
    path('roombyidhospital/<int:idhospital>/', views.RoomByIdHospitalViewSet.as_view({'get': 'list'})),
    path('roombyidhospital/<int:idhospital>/statuspatient/<statuspatient>/', views.RoomByIdHospitalAndStatusPatientViewSet.as_view({'get': 'list'})),
    path('patientbyidhospital/<idhospital>/', views.PatientByIdHospitalViewSet.as_view({'get': 'list'})),
    # path('medicalrecordnotificationbyiddoctor/<iddoctor>/', views.MedicalRcordNotificationByidDoctorViewSet.as_view({'get': 'list'})),

    # APIView
    path('graphloginactivity/', views.GraphLoginActivity.as_view()),
    path('top3location/', views.Top3Location.as_view()),

    path('importbloodtestbypatient/', views.ImportBloodTestByPatientAPIView.as_view()),
    path('importbloodtestbynurse/', views.ImportBloodTestByNurseAPIView.as_view()),

    path('statisticbedcapacityplanning/', views.StatisticBedCapacityPlanningAPIView.as_view()),
    path('statisticinpatientlengthstay/', views.StatisticInPatientLengthStayAPIView.as_view()),
    path('statisticinpatientsummary/', views.StatisticInPatientSummaryAPIView.as_view()),

    # standar bloodtest
    path('standardbloodtest/', views.StandardBloodTestList.as_view()),
    path('standardbloodtest/<type>/', views.StandardBloodTestDetail.as_view()),

    path('synchronizeiot/', views.SynchronizeIot.as_view()),
  
    #  documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]