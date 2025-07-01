// export const BASEURL = 'https://ec2-54-151-142-104.ap-southeast-1.compute.amazonaws.com';
// export const BASEURL = 'https://ec2-108-136-223-68.ap-southeast-3.compute.amazonaws.com';
// export const BASEURL = 'http://localhost';
export const BASEURL = 'http://127.0.0.1:8000';
export const AWS_VITAL_SIGN = `${BASEURL}/api-numed/graphVvitalsign/`;
export const AUTH_URL_LOGIN = `${BASEURL}/auth-numed/token/login/`;
export const AUTH_URL_USERME = `${BASEURL}/auth-numed/users/me/`;

// reset password
export const RESETPASSWORD = `${BASEURL}/api-numed/password_reset/`;
export const RESETPASSWORDCONFIRM = `${BASEURL}/api-numed/password_reset/confirm/`;

// system admin
// dashboard
export const HISTORYSYSTEM_ALL = `${BASEURL}/api-numed/historyactivitysystem/`;
export const LOGINACTIVITY = `${BASEURL}/api-numed/loginactivity/`;
export const GRAP_HLOGINACTIVITY = `${BASEURL}/api-numed/graphloginactivity/`;
export const VITAL_SIGN = `${BASEURL}/api-numed/vitalsign/`;

// sidebar system admin
export const USERS_ALL = `${BASEURL}/api-numed/alluser/`;
export const USERS_MANAGEMENT = `${BASEURL}/auth-numed/users/`;
export const HOSPITAL_DETAIL = `${BASEURL}/api-numed/hospital/`;
export const ACTIVE_HOSPITAL = `${BASEURL}/api-numed/activehospital/`;
export const TOP3LOCATION = `${BASEURL}/api-numed/top3location/`;

// patient
export const ACCOUNT_PATIENT = `${BASEURL}/api-numed/patient/`;
export const MEDICALRECORD = `${BASEURL}/api-numed/medicalrecord/`;
export const SOAP_URL = `${BASEURL}/api-numed/soap/`;
export const SOAP_BYMEDICALRECORD_URL = `${BASEURL}/api-numed/soapbyidmedical/`;
export const SYNCHRONIZE_URL = `${BASEURL}/api-numed/synchronizeiot/`;

export const CXR_MEDICALRECORD = `${BASEURL}/api-numed/cxr/`;
export const CXRCOMPARE_MEDICALRECORD = `${BASEURL}/api-numed/cxrdetailcompare/`;
export const CTSCAN_MEDICALRECORD = `${BASEURL}/api-numed/ctscan/`;
export const CTSCANCOMPARE_MEDICALRECORD = `${BASEURL}/api-numed/ctscandetailcompare/`;
export const BLOODTEST_MEDICALRECORD = `${BASEURL}/api-numed/bloodtest/`;
export const STANDART_BLOODTEST_MEDICALRECORD = `${BASEURL}/api-numed/standardbloodtest/`;
export const PCRANTIGENTSWAB_MEDICALRECORD = `${BASEURL}/api-numed/pcrantigenswab/`;
export const OTHERS_MEDICALRECORD = `${BASEURL}/api-numed/othernote/`;
export const BLOODTEST_IMPORTBYPATIENT_MEDICALRECORD = `${BASEURL}/api-numed/importbloodtestbypatient/`;
export const BLOODTEST_IMPORTBYNURSE_MEDICALRECORD = `${BASEURL}/api-numed/importbloodtestbynurse/`;
export const PATIENT_ACTIVITIES = `${BASEURL}/api-numed/historyactivity/`;

// nurse & hospital
export const PATIENT_CXR = `${BASEURL}/api-numed/cxrbyidpatient/`;
export const PATIENT_CTSCAN = `${BASEURL}/api-numed/ctscanbyidpatient/`;
export const PATIENT_BLOODTEST = `${BASEURL}/api-numed/bloodtestbyidpatient/`;
export const PATIENT_PCRSWAB = `${BASEURL}/api-numed/pcrantigenswabbyidpatient/`;

// nurse
export const PATIENT_MEDICALRECORD_BYID = `${BASEURL}/api-numed/medicalrecordbyidpatient/`;
// export const PATIENT_MONITORINGLIST = `${BASEURL}/api-numed/monitoringpatientbyidpatient/`;
// export const PATIENT_MONITORING = `${BASEURL}/api-numed/monitoringpatient/`;

// doctor
export const ACCOUNT_DOCTOR = `${BASEURL}/api-numed/doctor/`;
// export const DOCTOR_BY_IDHOSPITAL = `${BASEURL}/api-numed/doctorbyidhospital/`;
// export const PATIENT_DOCTOR = `${BASEURL}/api-numed/patientdoctor/`;

// hospital admin
export const PATIENT_HOSPITAL = `${BASEURL}/api-numed/patientbyidhospital`;
export const ROOM_MANAGEMENT = `${BASEURL}/api-numed/room/`;
export const BUILDING_MANAGEMENT = `${BASEURL}/api-numed/buildinghospital/`;
export const BUILDING_BY_IDHOSPITAL = `${BASEURL}/api-numed/buildingbyidhospital/`;
export const BED_MANAGEMENT = `${BASEURL}/api-numed/bed/`;
export const BED_MANAGEMENT_CREATE = `${BASEURL}/api-numed/bed-create/`;
export const BED_BY_IDROOM = `${BASEURL}/api-numed/bedbyidroom/`;
export const ROOM_BYHOSPITALSTATUSPATIENT = `${BASEURL}/api-numed/room/`;
export const ROOM_BY_IDBUILDING = `${BASEURL}/api-numed/roombyidbuilding/`;
export const ROOM_BYIDHOSPITAL_MANAGEMENT = `${BASEURL}/api-numed/roombyidhospital/`;
export const SETTING_BYVITALSIGN = `${BASEURL}/api-numed/settingbyvitalsign/`;

// get api geojson indonesia
export const PROVINCE = `${BASEURL}/api-numed/province/`;

// statistic
export const STATISTIC_BEDCAPACITYPLANNING = `${BASEURL}/api-numed/statisticbedcapacityplanning/`;
export const STATISTIC_INPATIENTLENGTHOFSTAY = `${BASEURL}/api-numed/statisticinpatientlengthstay/`;
export const STATISTIC_INPATIENTSUMMARY = `${BASEURL}/api-numed/statisticinpatientsummary/`;
