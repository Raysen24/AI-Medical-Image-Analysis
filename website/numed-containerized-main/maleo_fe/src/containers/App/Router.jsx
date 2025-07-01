/* eslint-disable max-len */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Layout from '../Layout/index';
import MainWrapper from './MainWrapper';

// account
import LoginAccount from '../Account/Login';
import ResetPasswords from '../Account/ResetPassword';
import RegisterAccounts from '../Account/Register';
import Account from '../Account/Profile';
import WelcomingStatement from '../Account/WelcomeStatement';

// admin system
import DashboardSystemAdmin from '../SystemAdmin/Dashboard';
import UserManagement from '../SystemAdmin/SystemAdmin/UserMangement/UserManagement';
import DetailUserManagement from '../SystemAdmin/SystemAdmin/UserMangement/DetailUserManagement';
import Hospital from '../SystemAdmin/SystemAdmin/Hospital/Hospital';
import HospitalDetail from '../SystemAdmin/SystemAdmin/Hospital/DetailHospital';
import NewHospital from '../SystemAdmin/SystemAdmin/Hospital/AddHospital';

// patient
import DashboardPatient from '../Patient/Dashboard';
import PatientInformation from '../Patient/PatientInformation';
// cxr
// cxr patient
import CXRList from '../Patient/Input/CXR/CXRList';
import CXRFileUpload from '../Patient/Input/CXR/FileUpload';
import CXRResult from '../Patient/Input/CXR/Result';

// ctscan
import CTSCANListing from '../Patient/Input/CTScan/CTScanList';
import CTScanFileUpload from '../Patient/Input/CTScan/FileUpload';
import CTScanResult from '../Patient/Input/CTScan/Result';

// bloodtest
import BloodTestListing from '../Patient/Input/BloodTest/BloodTestList';
import ManualInputBloodTestForm from '../Patient/Input/BloodTest/FileUpload/Manual';
import FileUploadBloodTestForm from '../Patient/Input/BloodTest/FileUpload/FileDocument';
import BloodTestResult from '../Patient/Input/BloodTest/Result';

// pcr
import PCRListing from '../Patient/Input/PCR/PCRList';
import PCRFileUpload from '../Patient/Input/PCR/FileUpload';

// vsr
import VSRListing from '../Patient/Input/VSR/VSRList';
import VSRFileUpload from '../Patient/Input/VSR/FileUpload';
import VSRResult from '../Patient/Input/VSR/Result';

// manage patient
import MedicalRecordPatientList from '../Patient/MedicalRecord/ListingMedicalRecordPatient';
import NewMedicalRecordPatient from '../Patient/MedicalRecord/NewMedicalRecordPatient';
import DetailMedicalRecordPatient from '../Patient/MedicalRecord/DetailMedicalRecordPatient/DetailMedicalRecord';

// nurse
import DashboardNurses from '../Nurse/Dashboard';

// doctor
import DashboardDoctors from '../Doctor/Dashboard';

// Hospital Admin
import DashboardHospitalAdmin from '../HospitalAdmin/Dashboard';
import HAListingDataPatients from '../HospitalAdmin/HADataPatients';

// room
import ManageRoom from '../HospitalAdmin/ManageRoom/Room/RoomManagement';
import DetailManageRoom from '../HospitalAdmin/ManageRoom/Room/DetailRoomManagement';
import AddRoomManagement from '../HospitalAdmin/ManageRoom/Room/AddRoomManagement';
// building
import BuildingList from '../HospitalAdmin/ManageRoom/Building/BuildingList';
import NewBuilding from '../HospitalAdmin/ManageRoom/Building/NewBuilding';
import EditBuilding from '../HospitalAdmin/ManageRoom/Building/EditBuilding';
// bed
import BedList from '../HospitalAdmin/ManageRoom/Bed/BedList';
import NewBed from '../HospitalAdmin/ManageRoom/Bed/NewBed';
import DetailBed from '../HospitalAdmin/ManageRoom/Bed/DetailBed';

// hospital management
import DashboardHospitalManagement from '../HospitalManagement/Dashboard';
// route
import AdminRoute from '../../shared/components/AdminRoute';
import PatientRoute from '../../shared/components/PatientRoute';
import NurseRoute from '../../shared/components/NurseRoute';
import DoctorRoute from '../../shared/components/DoctorRoute';
import HospitalManagementRoute from '../../shared/components/HospitalManagementRoute';
import HospitalAdmin from '../../shared/components/HospitalAdmin';
import HospitalNursePatientRoute from '../../shared/components/HospitalNursePatientRoute';
import PrivateRoute from '../../shared/components/PrivateRoute';
import ResetPasswordConfirm from '../Account/ResetPasswordConfirm';
import FileUploadBloodTesNursetForm from '../Patient/Input/BloodTest/FileUpload/FileDocumentNurse/components/FileUploadBloodTesNursetForm';
import OtherList from '../Patient/Input/Others/OthersListing';
import OtherUpload from '../Patient/Input/Others/NewOthers';
import DetailOthersPatient from '../Patient/Input/Others/DetailMedicalRecord';
import Garmin from '../Patient/Garmin';
import IdentifyAi from '../Patient/Identify';

const Pages = () => (
  <Switch>
    {/* admin role */}
    <AdminRoute path="/dashboard/admin" component={DashboardSystemAdmin} />
    <AdminRoute path="/dashboard/user" component={UserManagement} />
    <AdminRoute path="/dashboard/user-detail/:id/" component={DetailUserManagement} />
    <AdminRoute path="/dashboard/hospital" component={Hospital} />
    <AdminRoute path="/dashboard/hospital-detail/:id/" component={HospitalDetail} />
    <AdminRoute path="/dashboard/new-hospital/" component={NewHospital} />

    {/* Patient role pentinf */}
    <PatientRoute path="/patient/index" component={DashboardPatient} />
    <PrivateRoute path="/patient-data/detail/:id" component={PatientInformation} />

    {/* hospital admin && Nurse && patient */}
    {/* cxr patient */}
    <HospitalNursePatientRoute path="/patient-data/input/cxr" component={CXRList} />
    <HospitalNursePatientRoute path="/patient-data/upload/cxr" component={CXRFileUpload} />
    <HospitalNursePatientRoute path="/input/result/cxr/:id" component={CXRResult} />

    {/* ct-scan */}
    <HospitalNursePatientRoute path="/patient-data/input/ct-scan" component={CTSCANListing} />
    <HospitalNursePatientRoute path="/patient-data/patient/upload/ct-scan" component={CTScanFileUpload} />
    <HospitalNursePatientRoute path="/input/result/ctscan/:id" component={CTScanResult} />

    {/* blood test */}
    <HospitalNursePatientRoute path="/patient-data/input/bloodtest" component={BloodTestListing} />
    <HospitalNursePatientRoute path="/input/bloodtestpatient/upload" component={FileUploadBloodTestForm} />
    <HospitalNursePatientRoute path="/input/bloodtest/upload" component={FileUploadBloodTesNursetForm} />
    <HospitalNursePatientRoute path="/input/bloodtest/manual" component={ManualInputBloodTestForm} />
    <HospitalNursePatientRoute path="/input/result/bloodtest/:id" component={BloodTestResult} />

    {/* pcr */}
    <HospitalNursePatientRoute path="/patient-data/input/pcr" component={PCRListing} />
    <HospitalNursePatientRoute path="/patient-data/input/upload" component={PCRFileUpload} />
    {/* <HospitalNursePatientRoute path="/input/resultpcr/:id/" component={PCRResult} /> */}

    <HospitalNursePatientRoute path="/patient-data/listing/others" component={OtherList} />
    <HospitalNursePatientRoute path="/patient-data/input/others" component={OtherUpload} />
    <HospitalNursePatientRoute path="/patient-data/input/other/:id" component={DetailOthersPatient} />
    {/* vsr */}
    <HospitalNursePatientRoute path="/patient-data/input/vsr" component={VSRListing} />
    <HospitalNursePatientRoute path="/input/vsr/manual" component={VSRFileUpload} />
    <HospitalNursePatientRoute path="/input/result/vsr" component={VSRResult} />

    {/* Manage */}
    <PrivateRoute path="/patient-data/medical-record/:id" component={MedicalRecordPatientList} />
    <PrivateRoute path="/patient-data/new-medical-record/:id" component={NewMedicalRecordPatient} />
    <PrivateRoute path="/patient-data/detail-medical-record/:id" component={DetailMedicalRecordPatient} />

    {/* Nurse role */}
    <NurseRoute path="/nurse/index" component={DashboardNurses} />

    {/* Doctor Route  */}
    <DoctorRoute path="/doctor/index" component={DashboardDoctors} />

    {/* Hospital Management */}
    <HospitalManagementRoute path="/management/index" component={DashboardHospitalManagement} />

    {/* Hospital Admin */}
    <HospitalAdmin path="/hospital/index" component={DashboardHospitalAdmin} />
    <HospitalAdmin path="/hospital/patient/list/" component={HAListingDataPatients} />
    <HospitalAdmin path="/hospital/room/" component={ManageRoom} />
    <HospitalAdmin path="/hospital/room-detail/:id/" component={DetailManageRoom} />
    <HospitalAdmin path="/hospital/new-room/" component={AddRoomManagement} />
    <HospitalAdmin path="/hospital/building/" component={BuildingList} />
    <HospitalAdmin path="/hospital/new-building/" component={NewBuilding} />
    <HospitalAdmin path="/hospital/building-detail/:id" component={EditBuilding} />
    <HospitalAdmin path="/hospital/bed/" component={BedList} />
    <HospitalAdmin path="/hospital/new-bed/" component={NewBed} />
    <HospitalAdmin path="/hospital/bed-detail/:id" component={DetailBed} />

    {/* garmin */}
    <PrivateRoute path="/patient/garmin/index" component={Garmin} />

    {/* Identify */}
    <PrivateRoute path="/patient/Identify/index" component={IdentifyAi} />
    {/* Account */}
    <PrivateRoute path="/account/index/" component={Account} />
    <PrivateRoute path="/account/welcome-statement/" component={WelcomingStatement} />
  </Switch>
);

const wrappedRoutes = () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <PrivateRoute path="/account/" component={Pages} />
      <AdminRoute path="/dashboard/" component={Pages} />
      <PatientRoute path="/patient/" component={Pages} />
      <NurseRoute path="/nurse/" component={Pages} />
      <PrivateRoute path="/nurse-hospital/" component={Pages} />
      <HospitalNursePatientRoute path="/patient-data/" component={Pages} />
      <PrivateRoute path="/input/" component={Pages} />
      <DoctorRoute path="/doctor/" component={Pages} />
      <HospitalManagementRoute path="/management/" component={Pages} />
      <HospitalAdmin path="/hospital/" component={Pages} />
    </div>
  </div>
);

const Router = () => (
  <MainWrapper>
    <main>
      <Switch>
        <Route exact path="/" component={LoginAccount} />
        <Route exact path="/log_in" component={LoginAccount} />
        <Route exact path="/register" component={RegisterAccounts} />
        <Route exact path="/reset_password" component={ResetPasswords} />
        <Route exact path="/reset_password/:token" component={ResetPasswordConfirm} />
        <Route path="/" component={wrappedRoutes} />
      </Switch>
    </main>
  </MainWrapper>
);

export default Router;
