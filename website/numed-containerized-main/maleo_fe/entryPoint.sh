#!/bin/bash
set -xe
: "${SERVER_ADDRESS?Need an api url}"

sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /code/public/menu.html
sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /code/src/utils/EndPoints.js
sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /code/src/containers/Patient/Input/BloodTest/FileUpload/FileDocument/components/FileUploadBloodTestForm.js
sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /code/src/containers/Patient/Input/BloodTest/FileUpload/FileDocumentNurse/components/FileUploadBloodTesNursetForm.js
sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /code/src/containers/Patient/Garmin/index.js
sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /code/src/containers/HospitalAdmin/Dashboard/EWSSummary/index.jsx 
sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /code/src/containers/HospitalAdmin/Dashboard/PatientAlert/PatientAlertCard.jsx
sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /code/src/containers/HospitalAdmin/Dashboard/RoomCapacity/index.jsx
sed -i "s/SERVER_ADDRESS/$SERVER_ADDRESS/g" /code/src/containers/Patient/Input/VSR/Result/index.jsx
sed -i "s/SCHEMA/$SCHEMA/g" /code/src/utils/EndPoints.js
sed -i "s/SCHEMA/$SCHEMA/g" /code/src/containers/Patient/Input/BloodTest/FileUpload/FileDocument/components/FileUploadBloodTestForm.js
sed -i "s/SCHEMA/$SCHEMA/g" /code/src/containers/Patient/Input/BloodTest/FileUpload/FileDocumentNurse/components/FileUploadBloodTesNursetForm.js
sed -i "s/SCHEMA/$SCHEMA/g" /code/src/containers/Patient/Garmin/index.js
sed -i "s/SCHEMA/$SCHEMA/g" /code/src/containers/HospitalAdmin/Dashboard/EWSSummary/index.jsx 
sed -i "s/SCHEMA/$SCHEMA/g" /code/src/containers/HospitalAdmin/Dashboard/PatientAlert/PatientAlertCard.jsx
sed -i "s/SCHEMA/$SCHEMA/g" /code/src/containers/HospitalAdmin/Dashboard/RoomCapacity/index.jsx
sed -i "s/SCHEMA/$SCHEMA/g" /code/src/containers/Patient/Input/VSR/Result/index.jsx

exec "$@"
