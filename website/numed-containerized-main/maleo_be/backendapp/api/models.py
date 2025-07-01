from email.policy import default
from enum import unique
from django.db import models
import datetime
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.db.models.fields import related
from account.models import CustomUser, Hospital
from django.db.models.signals import post_save
from backendapp import settings
from django.template.loader import get_template
from django.core.mail import send_mail, EmailMessage
from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField

# Create your models here.

########### SEND EMAIL DJANGO RESET PASSWORD
@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):

    email = reset_password_token.user.email
    subject = "Password Reset Requested"
    email_template_name = "registration/resetpasswordapi.txt"
    c = {
        'site_name' : 'master.d34vvqkaosooa9.amplifyapp.com',
        'domain' : 'master.d34vvqkaosooa9.amplifyapp.com/reset_password',
        'user' : reset_password_token.user.email,
        'token' : reset_password_token.key,
        'protocol' : 'http',
    }

    email_description = render_to_string(email_template_name, c)

    send_mail(subject, email_description, settings.EMAIL_HOST_USER, [email], fail_silently=False)
  
# get API-JSON 
class Province(models.Model):
  unique_id = models.BigIntegerField(default=0, unique=True)
  name = models.CharField(max_length=255, default='')

  def __str__(self) -> str:
    return '{}'.format(self.name)

class Regency(models.Model): #kabupaten
  unique_id = models.BigIntegerField(default=0, unique=True)
  province_id = models.ForeignKey(Province, on_delete=models.CASCADE, null=True)
  name = models.CharField(max_length=255, default='')

  def __str__(self) -> str:
    return '{} | {}'.format(self.unique_id, self.name)

class District(models.Model): #kecamatan
  unique_id = models.BigIntegerField(default=0, unique=True)
  regency_id = models.ForeignKey(Regency, on_delete=models.CASCADE, null=True)
  name = models.CharField(max_length=255, default='')

  def __str__(self) -> str:
    return '{}'.format(self.name)

class Subdistrict(models.Model): #kelurahan
  unique_id = models.BigIntegerField(default=0, unique=True)
  district_id = models.ForeignKey(District, on_delete=models.CASCADE, null=True)
  name = models.CharField(max_length=255, default='')

  def __str__(self) -> str:
    return '{} | {}'.format(self.unique_id, self.name)

class BuildingHospital(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  hospital_id = models.ForeignKey(Hospital, on_delete=models.CASCADE, null=True)
  name = models.CharField(max_length=255, default='')

  def __str__(self) -> str:
    return '{}'.format(self.name)

class Room(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  building_id = models.ForeignKey(BuildingHospital, on_delete=models.CASCADE, null=True)
  room_name = models.CharField(max_length=255, default='') #poliklink
  room_number = models.IntegerField(default=0)
  is_active = models.BooleanField(default=True)

  def __str__(self) -> str:
      return '{} | {}'.format(self.room_name, self.room_number)


class Bed(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  room_id = models.ForeignKey(Room, on_delete=models.CASCADE, null=True)
  bed_number = models.IntegerField(default=0)
  is_occupied = models.BooleanField(default=False)

  def save(self, *args, **kwargs):
    super().save(*args, **kwargs)
    # Logic membuat table statistic
    # 1. jika occupied (terisi)
    if self.is_occupied == True:
      rooms_by_building = Room.objects.filter(
        building_id=self.room_id.building_id,
        is_active=True
      )
      beds_by_room = Bed.objects.filter(
        room_id=self.room_id,
      )
      beds_occupied_by_room = beds_by_room.filter(
        room_id=self.room_id,
        is_occupied=True
      )
      created = Statistic.objects.create(
        type='Bed Capacity Planning',
        hospital_id=self.room_id.building_id.hospital_id,
        building_id=self.room_id.building_id,
        room_allocation=rooms_by_building.count(),
        total_bed=beds_by_room.count(),
        bed_occupied=beds_occupied_by_room.count()
      )
    
    # 2. jika tidak terisi
    if self.is_occupied == False:
      rooms_by_building = Room.objects.filter(
        building_id=self.room_id.building_id,
        is_active=True
      )
      beds_by_room = Bed.objects.filter(
        room_id=self.room_id,
      )
      beds_occupied_by_room = beds_by_room.filter(
        room_id=self.room_id,
        is_occupied=True
      )
      created = Statistic.objects.create(
        type='Bed Capacity Planning',
        hospital_id=self.room_id.building_id.hospital_id,
        building_id=self.room_id.building_id,
        room_allocation=rooms_by_building.count(),
        total_bed=beds_by_room.count(),
        bed_occupied=beds_occupied_by_room.count()
      )


  def __str__(self) -> str:
      return '{}'.format(self.bed_number)

class MedicalRecord(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  mr_id_patient = models.CharField(max_length=255, default='')
  # doctor_id = models.ManyToManyField(CustomUser)
  patient_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='doctorpatient', null=True)
  LISTPATIENTSTATUS = (
    ('Inpatient', 'Inpatient'),
    ('Outpatient', 'Outpatient'),
  )
  patient_status = models.CharField(max_length=255, choices=LISTPATIENTSTATUS, null=True)
  hospital_id = models.ForeignKey(Hospital, on_delete=models.SET_NULL, blank=True, null=True)
  building_id = models.ForeignKey(BuildingHospital, on_delete=models.SET_NULL, blank=True, null=True)
  room_id = models.ForeignKey(Room, on_delete=models.SET_NULL, blank=True, null=True)
  bed_id = models.ForeignKey(Bed, on_delete=models.SET_NULL, blank=True, null=True)
  # doctor_notes = models.TextField(blank=True, null=True)
  # update_date_doctor = models.DateField(blank=True, null=True)
  # nurse_notes = models.TextField(blank=True, null=True)
  # update_date_nurse = models.DateField(blank=True, null=True)
  # notes = models.TextField(blank=True, null=True) #catatan harian
  # anamnesa = models.TextField(blank=True, null=True) # diisi pas pertama kali buat episode / medical record
  # decision = models.CharField(max_length=255, blank=True, null=True)
  admission_date = models.DateField(blank=True, null=True)
  death_date = models.DateField(blank=True, null=True)
  discharged_date = models.DateField(blank=True, null=True)
  fall_score = models.FloatField(default=0)

  def save(self, *args, **kwargs):
    # Logic bed occupied ketika belum selesai save
    if self.patient_id and self.mr_id_patient:
        user = self.patient_id
        user.mr_id_patient = self.mr_id_patient
        user.save()

        # Logic membuat table statistic
        # rubah bed is_occupied
        if self.patient_status == 'Inpatient' and self.bed_id:
          bed = self.bed_id
          bed.is_occupied = True
          bed.save()
        
    super().save(*args, **kwargs)

    # logic menambahkan statistic ketika sudah di save
    if self.admission_date != None and self.discharged_date != None:
      selisih = (self.discharged_date - self.admission_date).days
      # 1. logic statistic in length of stay
      Statistic.objects.create(
        hospital_id=self.hospital_id,
        building_id=self.building_id,
        type='Inpatient Length of Stay',
        day_of_stay=int(selisih) + 1
      )

      # 2. logic statistic inpatient summary
      admittedCount = MedicalRecord.objects.filter(
        admission_date__year=self.admission_date.year,
        admission_date__month=self.admission_date.month
      ).count()
      Statistic.objects.create(
        hospital_id=self.hospital_id,
        building_id=self.building_id,
        type='Inpatient Summary',
        admitted=admittedCount
      )
      #  3. ubah status bed menjadi available
      if self.bed_id:
        bed = self.bed_id
        bed.is_occupied = False
        bed.save()

    if self.admission_date != None and self.death_date != None:
      selisih = (self.death_date - self.admission_date).days
      # 1. logic statistic in length of stay
      Statistic.objects.create(
        hospital_id=self.hospital_id,
        building_id=self.building_id,
        type='Inpatient Length of Stay',
        day_of_stay=int(selisih) + 1
      )
      # 2. logic statistic inpatient summary
      admittedCount = MedicalRecord.objects.filter(
        admission_date__year=self.admission_date.year,
        admission_date__month=self.admission_date.month
      ).count()
      Statistic.objects.create(
        hospital_id=self.hospital_id,
        building_id=self.building_id,
        type='Inpatient Summary',
        admitted=admittedCount
      )
      deathCount = MedicalRecord.objects.filter(
        death_date__year=self.death_date.year,
        death_date__month=self.death_date.month
      ).count()
      Statistic.objects.create(
        hospital_id=self.hospital_id,
        building_id=self.building_id,
        type='Inpatient Summary',
        death=deathCount
      )
      #  3. ubah status bed menjadi available
      if self.bed_id:
        bed = self.bed_id
        bed.is_occupied = False
        bed.save()

  def delete(self, *args, **kwargs):
    bed = self.bed_id
    bed.is_occupied = False
    bed.save()
    super().delete(*args, **kwargs)

class Soap(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  medical_id = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True)
  patient_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_soap', null=True)
  created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_soap', null=True)
  subjective = RichTextUploadingField(blank=True, null=True)
  objective = RichTextUploadingField(blank=True, null=True)
  assessment = RichTextUploadingField(blank=True, null=True)
  plan = RichTextUploadingField(blank=True, null=True)
  disease_now =  models.TextField(blank=True, null=True)
  disease_old =  models.TextField(blank=True, null=True)
  complaint = models.TextField(blank=True, null=True)
  room_name = models.CharField(max_length=255, blank=True, null=True)

# class MedicalRecordNotification(models.Model):
#   created_at = models.DateTimeField(default=datetime.datetime.now)
#   medical_id = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True)
#   doctor_id = models.ForeignKey(CustomUser,on_delete=models.CASCADE, null=True)
#   is_read = models.BooleanField(default=False)

#   def save(self, *args, **kwargs):        
#     super().save(*args, **kwargs)
#     notification_doctor_mr = MedicalRecordNotification.objects.filter(
#       medical_id = self.medical_id,
#       doctor_id = self.doctor_id
#     )
#     if len(notification_doctor_mr) == 1:
#       template = get_template('notification/medicalrecord.html')
#       context = {
#           'medical': self.medical_id,
#       }
#       subject = 'Notifikasi Assign Doctor'
#       content = template.render(context)
#       msg = EmailMessage(
#           subject,
#           content,
#           'numedai50@gmail.com',
#           ['khoirula964@gmail.com']
#       )
#       msg.content_subtype = 'html'
#       msg.send()
#     else:
#       last_notification = MedicalRecordNotification.objects.filter(id=self.id).last()
#       if last_notification != None:
#         last_notification.delete()


class CXR(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  medical_id = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True)
  patient_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient', null=True)
  upload_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='upload_by', null=True)
  hospital_id = models.ForeignKey(Hospital, on_delete=models.CASCADE, blank=True, null=True)
  doctor_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='doctor_id', blank=True, null=True)
  doctor_note = models.TextField(blank=True, null=True)
  image = models.FileField(upload_to='cxr/image/', null=True)
  image_result = models.FileField(upload_to='cxr/image_result/', blank=True, null=True)
  pneumonia = models.FloatField(default=0)
  covid = models.FloatField(default=0)
  normal = models.FloatField(default=0)

  def delete(self, *args, **kwargs):
    self.image.delete()
    self.image_result.delete()
    super().delete(*args, **kwargs)

  @classmethod
  def post_create(cls, sender, instance, created, *args, **kwargs):
    HistoryActivity.objects.create(
        patient_id=instance.patient_id, type='CXR', notes='Create CXR'
      )
post_save.connect(CXR.post_create, sender=CXR)

class CTScan(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  medical_id = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True)
  patient_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_ctscan', null=True)
  upload_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='upload_by_ctscan', null=True)
  hospital_id = models.ForeignKey(Hospital, on_delete=models.CASCADE, blank=True, null=True)
  doctor_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='doctor_id_ct_scan', blank=True, null=True)
  doctor_note = models.TextField(blank=True, null=True)
  image = models.FileField(upload_to='ctscan/image/', null=True)
  image_result = models.FileField(upload_to='ctscan/image_result/', blank=True, null=True)
  diagnosis = models.CharField(max_length=255, blank=True, null=True)
  confidence = models.FloatField(default=0)
  
  def delete(self, *args, **kwargs):
    self.image.delete()
    self.image_result.delete()
    super().delete(*args, **kwargs)

  @classmethod
  def post_create(cls, sender, instance, created, *args, **kwargs):
      HistoryActivity.objects.create(
        patient_id=instance.patient_id, type='CT-Scan', notes='Create CT-Scan'
      )

post_save.connect(CTScan.post_create, sender=CTScan)

class StandardBloodTest(models.Model):
  LISTTYPE = (
    ('ca', 'ca'),
    ('ck', 'ck'),
    ('crea', 'crea'),
    ('alp', 'alp'),
    ('ggt', 'ggt'),
    ('glu', 'glu'),
    ('ast', 'ast'),
    ('alt', 'alt'),
    ('ldh', 'ldh'),
    ('crp', 'crp'),
    ('k', 'k'),
    ('na', 'na'),
    ('urea', 'urea'),
    ('wbc', 'wbc'),
    ('rbc', 'rbc'),
    ('hgb', 'hgb'),
    ('hct', 'hct'),
    ('mcv', 'mcv'),
    ('mch', 'mch'),
    ('mchc', 'mchc'),
    ('plt1', 'plt1'),
    ('ne', 'ne'),
    ('ly', 'ly'),
    ('mo', 'mo'),
    ('eo', 'eo'),
    ('ba', 'ba'),
    ('net', 'net'),
    ('lyt', 'lyt'),
    ('mot', 'mot'),
    ('eot', 'eot'),
    ('bat', 'bat'),
    
    ('basofil', 'basofil'),
    ('cl', 'cl'),
    ('creat', 'creat'),
    ('eos', 'eos'),
    ('eri', 'eri'),
    ('gsdfull', 'gsdfull'),
    ('hb', 'hb'),
    ('hct', 'hct'),
    ('k', 'k'),
    ('limfosit', 'limfosit'),
    ('mch', 'mch'),
    ('mchc', 'mchc'),
    ('mcv', 'mcv'),
    ('monosit', 'monosit'),
    ('na', 'na'),
    ('neutb', 'neutb'),
    ('nlr1', 'nlr1'),
    ('plt', 'plt'),
    ('rdw', 'rdw'),
    ('segmen', 'segmen'),
    ('sgot', 'sgot'),
    ('sgpt', 'sgpt'),
    ('ureum', 'ureum'),
    ('led', 'led'),
    ('bildirek', 'bildirek'),
    ('bilindir', 'bilindir'),
    ('biltot', 'biltot'),
    ('hco3_n', 'hco3_n'),
    ('o2s_n', 'o2s_n'),
    ('pco2_n', 'pco2_n'),
    ('ph_nu', 'ph_nu'),
    ('po2_n', 'po2_n'),
    ('tco2_n', 'tco2_n'),
    ('ptinr', 'ptinr'),
    ('bjurin', 'bjurin'),
    ('phurin', 'phurin'),
    ('choles', 'choles'),
    ('gdpfull', 'gdpfull'),
    ('gdppfull', 'gdppfull'),
    ('hdlcho', 'hdlcho'),
    ('ldlcho', 'ldlcho'),
    ('trigl', 'trigl'),
    ('ua', 'ua'),
    ('tshsnew', 'tshsnew'),
    ('albcp', 'albcp'),
    ('tp', 'tp'),
    ('t4', 't4'),
    ('caltot', 'caltot'),
    ('mg', 'mg'),
    ('glurapid', 'glurapid'),
    ('hdld', 'hdld'),
    ('alp', 'alp'),
    ('ggt', 'ggt'),
    ('glob', 'glob'),
    ('ldh', 'ldh'),
    ('ft4', 'ft4'),
    ('lakt_dr', 'lakt_dr'),
    ('acp001', 'acp001'),
    ('acp002', 'acp002'),
    ('acp009', 'acp009'),
    ('cglu', 'cglu'),
    ('cldh', 'cldh'),
    ('cprot', 'cprot'),
    ('sglu', 'sglu'),
    ('sldh', 'sldh'),
    ('sprot', 'sprot'),
    ('aca001', 'aca001'),
    ('aca002', 'aca002'),
    ('aca009', 'aca009'),
    ('cglua', 'cglua'),
    ('cldha', 'cldha'),
    ('cprota', 'cprota'),
    ('sglua', 'sglua'),
    ('sldha', 'sldha'),
    ('sprota', 'sprota'),
  )
  type = models.CharField(max_length=50, choices=LISTTYPE, unique=True)
  # normal = models.FloatField(blank=True, null=True)
  upper_normal = models.FloatField(blank=True, null=True)
  lower_normal = models.FloatField(blank=True, null=True)

  def __str__(self) -> str:
      return '{}'.format(self.type)

class BloodTest(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  medical_id = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True)
  patient_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_bloodtest', null=True)
  upload_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='upload_by_bloodtest', null=True)
  hospital_id = models.ForeignKey(Hospital, on_delete=models.CASCADE, blank=True, null=True)
  basofil = models.FloatField(blank=True, null=True)
  cl = models.FloatField(blank=True, null=True)
  creat = models.FloatField(blank=True, null=True)
  eos = models.FloatField(blank=True, null=True)
  eri = models.FloatField(blank=True, null=True)
  gsdfull = models.FloatField(blank=True, null=True)
  hb = models.FloatField(blank=True, null=True)
  hct = models.FloatField(blank=True, null=True)
  k = models.FloatField(blank=True, null=True)
  leko = models.FloatField(blank=True, null=True)
  limfosit = models.FloatField(blank=True, null=True)
  mch = models.FloatField(blank=True, null=True)
  mchc = models.FloatField(blank=True, null=True)
  mcv = models.FloatField(blank=True, null=True)
  monosit = models.FloatField(blank=True, null=True)
  na = models.FloatField(blank=True, null=True)
  neutb = models.FloatField(blank=True, null=True)
  nlr1 = models.FloatField(blank=True, null=True)
  plt = models.FloatField(blank=True, null=True)
  rdw = models.FloatField(blank=True, null=True)
  segmen = models.FloatField(blank=True, null=True)
  sgot = models.FloatField(blank=True, null=True)
  sgpt = models.FloatField(blank=True, null=True)
  ureum = models.FloatField(blank=True, null=True)
  led = models.FloatField(blank=True, null=True)
  bildirek = models.FloatField(blank=True, null=True)
  bilindir = models.FloatField(blank=True, null=True)
  biltot = models.FloatField(blank=True, null=True)
  hco3_n = models.FloatField(blank=True, null=True)
  o2s_n = models.FloatField(blank=True, null=True) #o2s_n
  pco2_n = models.FloatField(blank=True, null=True) #pco2_n
  ph_nu = models.FloatField(blank=True, null=True) #ph_nu
  po2_n = models.FloatField(blank=True, null=True) #po2_n
  tco2_n = models.FloatField(blank=True, null=True) #tco2_n
  ptinr = models.FloatField(blank=True, null=True)
  bjurin = models.FloatField(blank=True, null=True)
  phurin = models.FloatField(blank=True, null=True)
  choles = models.FloatField(blank=True, null=True)
  gdpfull = models.FloatField(blank=True, null=True)
  gdppfull = models.FloatField(blank=True, null=True)
  hdlcho = models.FloatField(blank=True, null=True)
  ldlcho = models.FloatField(blank=True, null=True)
  trigl = models.FloatField(blank=True, null=True)
  ua = models.FloatField(blank=True, null=True)
  tshsnew = models.FloatField(blank=True, null=True)
  albcp = models.FloatField(blank=True, null=True)
  tp = models.FloatField(blank=True, null=True)
  t4 = models.FloatField(blank=True, null=True) 
  caltot = models.FloatField(blank=True, null=True)
  mg = models.FloatField(blank=True, null=True)
  glurapid = models.FloatField(blank=True, null=True)
  hdld = models.FloatField(blank=True, null=True)
  alp = models.FloatField(blank=True, null=True)
  ggt = models.FloatField(blank=True, null=True)
  glob = models.FloatField(blank=True, null=True)
  ldh = models.FloatField(blank=True, null=True)
  ft4 = models.FloatField(blank=True, null=True)
  lakt_dr = models.FloatField(blank=True, null=True)
  acp001 = models.FloatField(blank=True, null=True)
  acp002 = models.FloatField(blank=True, null=True)
  acp009 = models.FloatField(blank=True, null=True)
  cglu = models.FloatField(blank=True, null=True)
  cldh = models.FloatField(blank=True, null=True)
  cprot = models.FloatField(blank=True, null=True)
  sglu = models.FloatField(blank=True, null=True)
  sldh = models.FloatField(blank=True, null=True)
  sprot = models.FloatField(blank=True, null=True)
  aca001 = models.FloatField(blank=True, null=True)
  aca002 = models.FloatField(blank=True, null=True)
  aca009 = models.FloatField(blank=True, null=True)
  cglua = models.FloatField(blank=True, null=True)
  cldha = models.FloatField(blank=True, null=True)
  cprota = models.FloatField(blank=True, null=True)
  sglua = models.FloatField(blank=True, null=True)
  sldha = models.FloatField(blank=True, null=True)
  sprota = models.FloatField(blank=True, null=True)
  tgl_lahir = models.IntegerField(default=0)

  probapredict = models.FloatField(default=0) # <-- result
  classpredict = models.FloatField(default=0) # <-- result


  @classmethod
  def post_create(cls, sender, instance, created, *args, **kwargs):
    HistoryActivity.objects.create(
        patient_id=instance.patient_id, type='Blood Test', notes='Create Blood Test'
      )

post_save.connect(BloodTest.post_create, sender=BloodTest)

class PcrAntigenSwab(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  medical_id = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True)
  patient_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_pcrantigen', null=True)
  upload_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='upload_by_pcrantigen', null=True)
  hospital_id = models.ForeignKey(Hospital, on_delete=models.CASCADE, blank=True, null=True)
  LISTCATEGORY = (
    ('Antigen Swab', 'Antigen Swab'),
    ('PCR', 'PCR'),
  )
  category = models.CharField(max_length=50, choices=LISTCATEGORY)
  LISTRESULT = (
    ('Positive', 'Positive'),
    ('Negative', 'Negative'),
  )
  result = models.CharField(max_length=50, choices=LISTRESULT, null=True)
  ct_value = models.CharField(max_length=255, blank=True, null=True)
  date = models.DateField(null=True)
  # # SWAB
  # date_swab = models.DateField(blank=True, null=True)
  # LISTPARAMETERSWAB = (
  #   ('Swab Antigen Test SARS-CoV2', 'Swab Antigen Test SARS-CoV2'),
  # )
  # parameter_swab = models.CharField(max_length=255, blank=True, null=True, choices=LISTPARAMETERSWAB)
  # LISTMEDTODESWAB = (
  #   ('Nasofaring','Nasofaring'),
  # )
  # metode_swab = models.CharField(max_length=255, blank=True, null=True, choices=LISTMEDTODESWAB)
  # LISTRESULTSWAB = (
  #   ('Positive', 'Positive'),
  #   ('Negative', 'Negative'),
  # )
  # result_swab = models.CharField(max_length=255, blank=True, null=True, choices=LISTRESULTSWAB)

  # # PCR
  # date_pcr = models.DateField(blank=True, null=True)
  # LISTPARAMETERPCR = (
  #   ('SARS-CoV2 Nucleic Acid Test (RT-PCR)','SARS-CoV2 Nucleic Acid Test (RT-PCR)'),
  #   ('CT value N gene','CT value N gene'),
  #   ('CT value ORF1ab','CT value ORF1ab'),
  # )
  # parameter_1_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTPARAMETERPCR)
  # parameter_2_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTPARAMETERPCR)
  # parameter_3_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTPARAMETERPCR)
  # LISTMEDTODEPCR = (
  #   ('Polymerase Chain Reaction','Polymerase Chain Reaction'),
  # )
  # metode_1_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTMEDTODEPCR)
  # metode_2_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTMEDTODEPCR)
  # metode_3_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTMEDTODEPCR)
  # LISTNORMALRANGEPCR = (
  #   ('Negative','Negative'),
  #   ('Undetection/CT > 38','Undetection/CT > 38'),
  # )
  # normal_range_1_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTNORMALRANGEPCR)
  # normal_range_2_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTNORMALRANGEPCR)
  # normal_range_3_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTNORMALRANGEPCR)
  # LISTRESULTPCR = (
  #   ('Negative', 'Negative'),
  #   ('Positive', 'Positive'),
  #   ('Not Detected', 'Not Detected')
  # )
  # result_1_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTRESULTPCR)
  # result_2_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTRESULTPCR)
  # result_3_pcr = models.CharField(max_length=255, blank=True, null=True, choices=LISTRESULTPCR)

  @classmethod
  def post_create(cls, sender, instance, created, *args, **kwargs):
    HistoryActivity.objects.create(
        patient_id=instance.patient_id, type='PCR/Antigen Swab Test', notes='Create PCR/Antigen Swab Test'
      )

post_save.connect(BloodTest.post_create, sender=BloodTest)


class HistoryActivity(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  patient_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True)
  LISTTYPEACTIVITY = (
    ('CXR', 'CXR'),
    ('CT-Scan', 'CT-Scan'),
    ('Blood Test', 'Blood Test'),
    ('Vital Sign Reading', 'Vital Sign Reading'),
    ('PCR/Antigen Swab Test', 'PCR/Antigen Swab Test'),
    ('Medical Record', 'Medical Record')
  )
  type = models.CharField(max_length=100, choices=LISTTYPEACTIVITY, null=True)
  notes = models.TextField(default='')

# class MonitoringPatient(models.Model):
#   created_at = models.DateTimeField(default=datetime.datetime.now)
#   updated_at = models.DateTimeField(auto_now=True)
#   medical_id = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True)
#   patient_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_mr', null=True)
#   created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_mr', null=True)
#   oxygen_aid = models.CharField(max_length=255, default='')
#   fall_score = models.FloatField(default=0)
#   ews_score = models.FloatField(default=0)
#   doctor_notes = models.TextField(blank=True, null=True)
#   update_date_doctor = models.DateField(blank=True, null=True)
#   nurse_notes = models.TextField(blank=True, null=True)
#   update_date_nurse = models.DateField(blank=True, null=True)
#   decision = models.CharField(max_length=255, blank=True, null=True)


class VitalSign(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  medical_id = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True)
  patient_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_vitalsign', null=True)
  upload_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='upload_by_vitalsign', null=True)
  hospital_id = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='hospital_vitalsign', null=True)
  blood_pressure = models.FloatField(default=0)
  respirotary_rate = models.FloatField(default=0)
  saturate = models.FloatField(default=0) # 02 saturation
  heart_rate = models.FloatField(default=0)
  temperature = models.FloatField(default=0)
  oxy_aid = models.CharField(max_length=255, blank=True, null=True)
  consciousness_level = models.BooleanField(default=False)
  ews_score = models.FloatField(default=0)

  def save(self, *args, **kwargs):
    if self.saturate >= 96:
      init_saturation = 0
    elif self.saturate >= 94:
      init_saturation = 1
    elif self.saturate >= 92:
      init_saturation =2
    else:
      init_saturation = 3
      
    if self.temperature >= 36.1 and self.temperature <= 38:
      init_temperature = 0
    elif (self.temperature >= 35.1 and self.temperature <= 36) or (self.temperature >= 38.1 and self.temperature < 39):
      init_temperature = 1
    elif self.temperature >= 39:
      init_temperature =2
    else:
      init_temperature = 3

    if self.heart_rate >= 51 and self.heart_rate <= 90:
      init_heartrate = 0
    elif (self.heart_rate >= 41 and self.heart_rate <= 50) or (self.heart_rate >= 91 and self.heart_rate <= 110):
      init_heartrate = 1
    elif self.heart_rate >= 111 and self.heart_rate <= 130:
      init_heartrate =2
    else:
      init_heartrate = 3

    if self.respirotary_rate >= 12 and self.respirotary_rate <= 20:
      init_respiratori = 0
    elif self.respirotary_rate >= 9 and self.respirotary_rate <= 11:
      init_respiratori = 1
    elif self.respirotary_rate >= 21 and self.respirotary_rate <= 24:
      init_respiratori =2
    else:
      init_respiratori = 3

    if self.blood_pressure >= 111 and self.blood_pressure <= 219:
      init_bloodpresure = 0
    elif self.blood_pressure >= 101 and self.blood_pressure <= 110:
      init_bloodpresure = 1
    elif self.blood_pressure >= 91 and self.blood_pressure <= 100:
      init_bloodpresure =2
    else:
      init_bloodpresure = 3

    if self.oxy_aid != None:
      init_oxy = 2
    else:
      init_oxy = 0

    if self.consciousness_level == True:
      init_conslevel = 3
    else:
      init_conslevel = 0

    self.ews_score = init_saturation + init_temperature + init_heartrate + init_respiratori + init_bloodpresure + init_oxy + init_conslevel
    super().save(*args, **kwargs)

class OtherNote(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  medical_id = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True)
  patient_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='patient_othernote', null=True)
  upload_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='upload_by_othernote', null=True)
  hospital_id = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='hospital_othernote', null=True)
  note = models.TextField(blank=True, null=True)

class Setting(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  LISTTYPE = (
    ('Standard O2 Saturation', 'Standard O2 Saturation'),
    ('Standard Blood Pressure', 'Standard Blood Pressure'),
    ('Standard Heart Rate', 'Standard Heart Rate'),
    ('Standard Respiratory Rate', 'Standard Respiratory Rate'),
    ('Standard Temperature', 'Standard Temperature'),
  )
  key = models.CharField(max_length=150, choices=LISTTYPE, null=True)
  value = models.CharField(max_length=100, default='')

class Statistic(models.Model):
  created_at = models.DateTimeField(default=datetime.datetime.now)
  updated_at = models.DateTimeField(auto_now=True)
  # date_length_of_stay = models.DateField(blank=True, null=True)
  hospital_id = models.ForeignKey(Hospital, on_delete=models.SET_NULL, blank=True, null=True)
  building_id = models.ForeignKey(BuildingHospital, on_delete=models.SET_NULL, blank=True, null=True)
  LISTTYPE = (
    ('Bed Capacity Planning', 'Bed Capacity Planning'),
    ('Inpatient Summary', 'Inpatient Summary'),
    ('Inpatient Length of Stay', 'Inpatient Length of Stay'),
  )
  type = models.CharField(max_length=255, choices=LISTTYPE, null=True)
  room_allocation = models.IntegerField(blank=True, null=True)
  total_bed = models.IntegerField(blank=True, null=True)
  bed_occupied = models.IntegerField(blank=True, null=True)
  day_of_stay = models.IntegerField(blank=True, null=True)
  admitted = models.IntegerField(blank=True, null=True)
  death = models.IntegerField(blank=True, null=True)

  def __str__(self) -> str:
      return '{} | {}'.format(self.created_at, self.type)
