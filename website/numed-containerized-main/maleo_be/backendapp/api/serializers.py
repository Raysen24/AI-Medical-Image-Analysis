# from requests.models import Response
from rest_framework import serializers
from account.models import CustomUser, Hospital, LoginActivity
from . import models
import datetime
import base64
import requests
import json
import PIL.Image as Image #pip install Pillow
import io
from django.core.files.uploadedfile import InMemoryUploadedFile


# url_cxr = 'http://175.41.179.70:6666/api/v1/cxr-app/image/'
# url_ctscan = 'http://175.41.179.70:6666/api/v1/ct-app/image/'
# url_blooadtest = 'http://175.41.179.70:6666/api/v1/blood-app/data'

# url_cxr = 'https://cxr.models.numed.ai/v1/image/'
# url_ctscan = 'https://ct.models.numed.ai/v1/image/'
# url_blooadtest = 'https://blood.models.numed.ai/v1/data'

url_cxr = 'http://cxr_app/image/'
url_ctscan = 'http://ct_app/image/'
url_blooadtest = 'http://blood_app/data'

def decodeDesignImage(data):
    try:
        data = base64.b64decode(data.encode('UTF-8'))
        buf = io.BytesIO(data)
        img = Image.open(buf)
        return img
    except:
        return None

class BedManagementCreate(serializers.Serializer):
    room_id = serializers.IntegerField()
    total_bed = serializers.IntegerField()

class HospitalSerializers(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'

class CustomUserSerializers(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            'fullname', 'dob', 'sex', 'photo', 'address', 'phone', 'email', 
            'role', 'province', 'regency', 'district', 'subdistrict', 'hospital', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = CustomUser(
            fullname=validated_data['fullname'],
            dob=validated_data['dob'],
            sex=validated_data['sex'],
            address=validated_data['address'],
            phone=validated_data['phone'],
            email=validated_data['email'],
            role=validated_data['role'],
            province=validated_data['province'],
            regency=validated_data['regency'],
            district=validated_data['district'],
            subdistrict=validated_data['subdistrict'],
        )
        user.set_password(validated_data['password'])

        hospitals = validated_data.get('hospital')
        user.save()
        if hospitals != []:
            for i in hospitals:
                user.hospital.add(i)
        return user
    
class AllUserSerializers(serializers.ModelSerializer):
    hospital_list = HospitalSerializers(source='hospital', many=True, read_only=True)
    class Meta:
        model = CustomUser
        exclude = ['password', 'is_staff', 'is_superuser', 'last_login', 'groups' ,'user_permissions']

class ProvinceSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Province
        fields = '__all__'

class RegencySerializers(serializers.ModelSerializer):
    province_detail = ProvinceSerializers(source='province_id', many=False, read_only=True)

    class Meta:
        model = models.Regency
        fields = '__all__'

class DistrictSerializers(serializers.ModelSerializer):
    regency_detail = RegencySerializers(source='regency_id', many=False, read_only=True)

    class Meta:
        model = models.District
        fields = '__all__'

class SubdistrictSerializers(serializers.ModelSerializer):
    district_detail = DistrictSerializers(source='district_id', many=False, read_only=True)

    class Meta:
        model = models.Subdistrict
        fields = '__all__'

class BuildingHospitalSerializers(serializers.ModelSerializer):
    hospital_detail = HospitalSerializers(source='hospital_id', many=False, read_only=True)

    class Meta:
        model = models.BuildingHospital
        fields = '__all__'

class RoomSerializers(serializers.ModelSerializer):
    building_detail = BuildingHospitalSerializers(source='building_id', many=False, read_only=True)
    class Meta:
        model = models.Room
        fields = '__all__'

class BedSerializers(serializers.ModelSerializer):
    room_detail = RoomSerializers(source='room_id', many=False, read_only=True)

    class Meta:
        model = models.Bed
        fields = '__all__'
        

class MedicalRecordSerializers(serializers.ModelSerializer):
    patient_detail = AllUserSerializers(source='patient_id', many=False, read_only=True)
    doctor_detail = AllUserSerializers(source='doctor_id', many=True, read_only=True)
    hospital_detail = HospitalSerializers(source='hospital_id', many=False, read_only=True)
    building_detail = BuildingHospitalSerializers(source='building_id', many=False, read_only=True)
    room_detail = RoomSerializers(source='room_id', many=False, read_only=True)
    bed_detail = BedSerializers(source='bed_id', many=False, read_only=True)

    class Meta:
        model = models.MedicalRecord
        fields = '__all__'

class SoapSerializers(serializers.ModelSerializer):
    created_by_detail = AllUserSerializers(source='created_by', many=False, read_only=True)

    class Meta:
        model = models.Soap
        fields = '__all__'

# class MedicalRecordNotificationSerializers(serializers.ModelSerializer):
#     medical_detail = MedicalRecordSerializers(source='medical_id', many=False, read_only=True)
#     doctor_detail = CustomUserSerializers(source='doctor_id', many=False, read_only=True)

#     class Meta:
#         model = models.MedicalRecordNotification
#         fields = '__all__'

#     def create(self, validated_data):
#         notification = models.MedicalRecordNotification.objects.create(
#             medical_id=validated_data.get('medical_id'),
#             doctor_id=validated_data.get('doctor_id'),
#         )
#         return notification

# class MonitoringPatientSerializers(serializers.ModelSerializer):
#     patient_detail = AllUserSerializers(source='patient_id', many=False, read_only=True)

#     class Meta:
#         model = models.MonitoringPatient
#         fields = '__all__'

#     def create(self, validated_data):
#         lastMedical = models.MedicalRecord.objects.filter(
#             patient_id=validated_data['patient_id']
#         ).last()
#         monitoringpatient = models.MonitoringPatient.objects.create(
#             created_at = validated_data['created_at'],
#             medical_id=lastMedical,
#             patient_id=validated_data.get('patient_id'),
#             created_by=validated_data.get('created_by'),
#             oxygen_aid=validated_data.get('oxygen_aid'),
#             fall_score=validated_data.get('fall_score'),
#             ews_score=validated_data.get('ews_score'),
#             doctor_notes=validated_data.get('doctor_notes'),
#             decision=validated_data.get('decision'),
#             update_date_doctor=validated_data.get('update_date_doctor'),
#             nurse_notes=validated_data.get('nurse_notes'),
#             update_date_nurse=validated_data.get('update_date_nurse'),
#         )
#         return monitoringpatient

class VitalSignSerializers(serializers.ModelSerializer):
    patient_detail = AllUserSerializers(source='patient_id', many=False, read_only=True)
    Hospital_detail = HospitalSerializers(source='hospital_id', many=False, read_only=True)
    class Meta:
        model = models.VitalSign
        fields = '__all__'

    def create(self, validated_data):
        lastMedical = models.MedicalRecord.objects.filter(
            patient_id=validated_data['patient_id']
        ).last()
        vitalsign = models.VitalSign.objects.create(
            medical_id=lastMedical,
            patient_id=validated_data.get('patient_id'),
            upload_by=validated_data.get('upload_by'),
            hospital_id=validated_data.get('hospital_id'),
            blood_pressure=validated_data.get('blood_pressure'),
            respirotary_rate=validated_data.get('respirotary_rate'),
            saturate=validated_data.get('saturate'),
            heart_rate=validated_data.get('heart_rate'),
            temperature=validated_data.get('temperature'),
            oxy_aid=validated_data.get('oxy_aid'),
            consciousness_level=validated_data.get('consciousness_level'),
        )
        return vitalsign

class OtherNoteSerializers(serializers.ModelSerializer):
    patient_detail = AllUserSerializers(source='patient_id', many=False, read_only=True)
    Hospital_detail = HospitalSerializers(source='hospital_id', many=False, read_only=True)
    upload_by_detail = AllUserSerializers(source='upload_by', many=False, read_only=True)
    class Meta:
        model = models.OtherNote
        fields = '__all__'

    def create(self, validated_data):
        lastMedical = models.MedicalRecord.objects.filter(
            patient_id=validated_data['patient_id']
        ).last()
        othernote = models.OtherNote.objects.create(
            medical_id=lastMedical,
            hospital_id=validated_data.get('hospital_id'),
            patient_id=validated_data.get('patient_id'),
            upload_by=validated_data.get('upload_by'),
            note=validated_data.get('note'),
        )
        return othernote

class SettingSerializers(serializers.ModelSerializer):
    class Meta:
        model = models.Setting
        fields = '__all__'
        

class LoginActivitySerializers(serializers.ModelSerializer):
    class Meta:
        model = LoginActivity
        fields = '__all__'

    def create(self, validated_data):
        user_id = validated_data.get('user_id')
        if user_id != None:
            activitytoday = LoginActivity.objects.filter(
                created_at__date=datetime.date.today(),
                user_id=user_id,
                activity='Login'
            ).last()
            # print(activitytoday)
            if activitytoday == None:
                activityuser = LoginActivity(
                    user_id=validated_data.get('user_id'),
                    activity=validated_data.get('activity')
                )
                activityuser.save()
            else:
                activityuser = activitytoday
        
        else:
            activityuser = LoginActivity(
                user_id=validated_data.get('user_id'),
                activity=validated_data.get('activity')
            )
            activityuser.save()

        return activityuser

class CXRSerializers(serializers.ModelSerializer):
    patient_detail = AllUserSerializers(source='patient_id', many=False, read_only=True)
    upload_by_detail = AllUserSerializers(source='upload_by', many=False, read_only=True)
    hospital_detail = HospitalSerializers(source='hospital_id', many=False, read_only=True)

    class Meta:
        model = models.CXR
        fields = '__all__'

    def create(self, validated_data):
        image=validated_data.get('image')
        lastMedical = models.MedicalRecord.objects.filter(
            patient_id=validated_data['patient_id']
        ).last()
        cxr = models.CXR.objects.create(
            upload_by=validated_data['upload_by'],
            patient_id=validated_data['patient_id'],
            medical_id=lastMedical,
            image=image, 
            hospital_id=validated_data.get('hospital_id'),
            doctor_id=validated_data.get('doctor_id'),
        )
        
        if cxr.image !=None:
            with open(cxr.image.path, "rb") as img_file:
                my_string = base64.b64encode(img_file.read())
                string_image = my_string.decode("utf-8")
                myobj = {
                    'data': string_image
                }
                header = {
                    'Content-Type': 'application/json', 
                }

                x = requests.post(
                    url_cxr,
                    json=myobj,
                    headers=header
                )
                resp = json.loads(x.text)
                if resp['status'] == 'success':
                    cxr.pneumonia = resp['pneumonia']
                    cxr.covid = resp['covid']
                    cxr.normal = resp['normal']
                    # ambil string image data respon
                    img = decodeDesignImage(resp['image_data'])
                    img_io = io.BytesIO()
                    img.save(img_io, format='PNG')
                    cxr.image_result = InMemoryUploadedFile(
                        img_io, field_name=None, name=str(cxr.id)+".png",
                        content_type='image/png', size=img_io.tell, charset=None
                    )
                    cxr.save()
                    return cxr
                else:
                    cxr.delete()
                    raise serializers.ValidationError({"status": "error cxr image upload"})

class CTScanSerializers(serializers.ModelSerializer):
    patient_detail = AllUserSerializers(source='patient_id', many=False, read_only=True)
    upload_by_detail = AllUserSerializers(source='upload_by', many=False, read_only=True)

    class Meta:
        model = models.CTScan
        fields = '__all__'

    def create(self, validated_data):
        image=validated_data.get('image')
        lastMedical = models.MedicalRecord.objects.filter(
            patient_id=validated_data['patient_id']
        ).last()
        ctscan = models.CTScan.objects.create(
            upload_by=validated_data['upload_by'],
            patient_id=validated_data['patient_id'],
            medical_id=lastMedical,
            image=image, 
            hospital_id=validated_data.get('hospital_id'),
            doctor_id=validated_data.get('doctor_id'),
        )

        if ctscan.image !=None:
            with open(ctscan.image.path, "rb") as img_file:
                my_string = base64.b64encode(img_file.read())
                string_image = my_string.decode("utf-8")
                myobj = {
                    'data': string_image
                }
                header = {
                    'Content-Type': 'application/json', 
                }

                x = requests.post(
                    url_ctscan,
                    json=myobj,
                    headers=header
                )
                resp = json.loads(x.text)
                if resp['status'] == 'success':
                    ctscan.diagnosis = resp['diagnosis']
                    ctscan.confidence = resp['confidence']
                    # ambil string image data respon
                    img = decodeDesignImage(resp['image_data'])
                    img_io = io.BytesIO()
                    img.save(img_io, format='PNG')
                    ctscan.image_result = InMemoryUploadedFile(
                        img_io, field_name=None, name=str(ctscan.id)+".png",
                        content_type='image/png', size=img_io.tell, charset=None
                    )
                    ctscan.save()
                    return ctscan
                else:
                    ctscan.delete()
                    raise serializers.ValidationError({"status": "error ct-scan image upload"})

class StandardBloodTestSerializers(serializers.ModelSerializer):

    class Meta:
        model = models.StandardBloodTest
        fields = '__all__'

class BloodTestSerializers(serializers.ModelSerializer):
    patient_detail = AllUserSerializers(source='patient_id', many=False, read_only=True)
    upload_by_detail = AllUserSerializers(source='upload_by', many=False, read_only=True)
    hospital_detail = HospitalSerializers(source='hospital_id', many=False, read_only=True)

    class Meta:
        model = models.BloodTest
        fields = '__all__'

    def create(self, validated_data):
        lastMedical = models.MedicalRecord.objects.filter(
            patient_id=validated_data['patient_id']
        ).last()
        
        basofil=validated_data.get('basofil')
        cl=validated_data.get('cl')
        creat=validated_data.get('creat')
        eos=validated_data.get('eos')
        eri=validated_data.get('eri')
        gsdfull=validated_data.get('gsdfull')
        hb=validated_data.get('hb')
        hct=validated_data.get('hct')
        k=validated_data.get('k')
        leko=validated_data.get('leko')
        limfosit=validated_data.get('limfosit')
        mch=validated_data.get('mch')
        mchc=validated_data.get('mchc')
        mcv=validated_data.get('mcv')
        monosit=validated_data.get('monosit')
        na=validated_data.get('na')
        neutb=validated_data.get('neutb')
        nlr1=validated_data.get('nlr1')
        plt=validated_data.get('plt')
        rdw=validated_data.get('rdw')
        segmen=validated_data.get('segmen')
        sgot=validated_data.get('sgot')
        sgpt=validated_data.get('sgpt')
        ureum=validated_data.get('ureum')
        led=validated_data.get('led')
        bildirek=validated_data.get('bildirek')
        bilindir=validated_data.get('bilindir')
        biltot=validated_data.get('biltot')
        hco3_n=validated_data.get('hco3_n')
        o2s_n=validated_data.get('o2s_n')
        pco2_n=validated_data.get('pco2_n')
        ph_nu=validated_data.get('ph_nu')
        po2_n=validated_data.get('po2_n')
        tco2_n=validated_data.get('tco2_n')
        ptinr=validated_data.get('ptinr')
        bjurin=validated_data.get('bjurin')
        phurin=validated_data.get('phurin')
        choles=validated_data.get('choles')
        gdpfull=validated_data.get('gdpfull')
        gdppfull=validated_data.get('gdppfull')
        hdlcho=validated_data.get('hdlcho')
        ldlcho=validated_data.get('ldlcho')
        trigl=validated_data.get('trigl')
        ua=validated_data.get('ua')
        tshsnew=validated_data.get('tshsnew')
        albcp=validated_data.get('albcp')
        tp=validated_data.get('tp')
        t4=validated_data.get('t4')
        mg=validated_data.get('mg')
        caltot=validated_data.get('caltot')
        glurapid=validated_data.get('glurapid')
        hdld=validated_data.get('hdld')
        alp=validated_data.get('alp')
        ggt=validated_data.get('ggt')
        glob=validated_data.get('glob')
        ldh=validated_data.get('ldh')
        ft4=validated_data.get('ft4')
        lakt_dr=validated_data.get('lakt_dr')
        acp001=validated_data.get('acp001')
        acp002=validated_data.get('acp002')
        acp009=validated_data.get('acp009')
        cglu=validated_data.get('cglu')
        cldh=validated_data.get('cldh')
        cprot=validated_data.get('cprot')
        sglu=validated_data.get('sglu')
        sldh=validated_data.get('sldh')
        sprot=validated_data.get('sprot')
        aca001=validated_data.get('aca001')
        aca002=validated_data.get('aca002')
        aca009=validated_data.get('aca009')
        cglua=validated_data.get('cglua')
        cldha=validated_data.get('cldha')
        cprota=validated_data.get('cprota')
        sglua=validated_data.get('sglua')
        sldha=validated_data.get('sldha')
        sprota=validated_data.get('sprota')
        tgl_lahir=validated_data.get('tgl_lahir')
        # 1. create record
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
            upload_by=validated_data['upload_by'],
            patient_id=validated_data['patient_id'],
            hospital_id=validated_data.get('hospital_id'),
            medical_id=lastMedical
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
            url_blooadtest,
            json={
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
                },
            # headers=header
        )

        resp = json.loads(x.text)
        if resp['status'] == 'success':
            bloodtest.probapredict = resp['probapredict']
            bloodtest.classpredict = resp['classpredict']
            bloodtest.save()
            return bloodtest
        else:
            # bloodtest.delete()
            raise serializers.ValidationError({"status": 'error input' + resp['err_message']})


class PcrAntigenSwabSerializers(serializers.ModelSerializer):
    upload_by_detail = AllUserSerializers(source='upload_by', many=False, read_only=True)
    patient_detail = AllUserSerializers(source='patient_id', many=False, read_only=True)

    class Meta:
        model = models.PcrAntigenSwab
        fields = '__all__'

    def create(self, validated_data):
        lastMedical = models.MedicalRecord.objects.filter(
            patient_id=validated_data['patient_id']
        ).last()
        pcrantigenswab = models.PcrAntigenSwab.objects.create(
            upload_by=validated_data['upload_by'],
            patient_id=validated_data['patient_id'],
            hospital_id=validated_data.get('hospital_id'),
            medical_id=lastMedical,
            result=validated_data.get('result'),
            ct_value=validated_data.get('ct_value'),
            date=validated_data.get('date'),
            category=validated_data.get('category'),
            # date_swab=validated_data.get('date_swab'),
            # parameter_swab=validated_data.get('parameter_swab'),
            # metode_swab=validated_data.get('metode_swab'),
            # result_swab=validated_data.get('result_swab'),
            # date_pcr=validated_data.get('date_pcr'),
            # parameter_1_pcr=validated_data.get('parameter_1_pcr'),
            # parameter_2_pcr=validated_data.get('parameter_2_pcr'),
            # parameter_3_pcr=validated_data.get('parameter_3_pcr'),
            # metode_1_pcr=validated_data.get('metode_1_pcr'),
            # metode_2_pcr=validated_data.get('metode_2_pcr'),
            # metode_3_pcr=validated_data.get('metode_3_pcr'),
            # normal_range_1_pcr=validated_data.get('normal_range_1_pcr'),
            # normal_range_2_pcr=validated_data.get('normal_range_2_pcr'),
            # normal_range_3_pcr=validated_data.get('normal_range_3_pcr'),
            # result_1_pcr=validated_data.get('result_1_pcr'),
            # result_2_pcr=validated_data.get('result_2_pcr'),
            # result_3_pcr=validated_data.get('result_3_pcr'),
        )
        return pcrantigenswab

class HistoryActivitySerializers(serializers.ModelSerializer):
    patient_detail = AllUserSerializers(source='patient_id', many=False, read_only=True)

    class Meta:
        model = models.HistoryActivity
        fields = '__all__'
