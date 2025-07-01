/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import { LOCALSTORAGE_USERDETAIL } from '../../../utils/Types';

const SidebarContent = ({ onClick }) => {
  const { t } = useTranslation('common');
  const handleHideSidebar = () => {
    onClick();
  };
  const [roleUser, setRoleUser] = useState(null);
  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    // console.log('token nih', userDetail);
    setRoleUser(userDetail.role);
  });
  // console.log(roleUser);

  return (
    <div className="sidebar__content">
      {/* System Admin */}
      {roleUser === 'System Admin' ? (
        <ul className="sidebar__block">
          <SidebarLink title="Dashboard" icon="home" route="/dashboard/admin" onClick={handleHideSidebar} />
          <SidebarCategory title="System Admin" icon="menu-circle">
            <SidebarLink title={t('system_admin.system_admin.page_title')} route="/dashboard/user" onClick={handleHideSidebar} />
            <SidebarLink title={t('system_admin.system_admin.hospital')} route="/dashboard/hospital" onClick={handleHideSidebar} />
          </SidebarCategory>
        </ul>
      ) : (
        ''
      )}
      {/* Patient */}
      {roleUser === 'Patient' ? (
        <ul className="sidebar__block">
          <SidebarLink title="Dashboard" icon="home" route="/patient/index" onClick={handleHideSidebar} />
          <SidebarCategory title="Input" icon="enter-down">
            <SidebarLink title="CXR" route="/patient-data/input/cxr" onClick={handleHideSidebar} />
            <SidebarLink title="CT-Scan" route="/patient-data/input/ct-scan" onClick={handleHideSidebar} />
            <SidebarLink title="Blood Test" route="/patient-data/input/bloodtest" onClick={handleHideSidebar} />
            <SidebarLink title="PCR/Antigen Swab Test" route="/patient-data/input/pcr" onClick={handleHideSidebar} />
            <SidebarLink title="Vital Sign Reading" route="/input/result/vsr" onClick={handleHideSidebar} />
            <SidebarLink title="Identify" route="/patient/identify/index" onClick={handleHideSidebar} />
            <SidebarLink title="Others" route="/patient-data/listing/others" onClick={handleHideSidebar} />
          </SidebarCategory>
          <SidebarLink title="Garmin" icon="heart-pulse" route="/patient/garmin/index" onClick={handleHideSidebar} />
        </ul>
      ) : (
        ''
      )}

      {/* Nurse */}
      {roleUser === 'Nurse' ? (
        <ul className="sidebar__block">
          <SidebarLink title="Dashboard Nurse" icon="home" route="/nurse/index" onClick={handleHideSidebar} />
          <SidebarCategory title="Input" icon="enter-down">
            <SidebarLink title="CXR" route="/patient-data/input/cxr" onClick={handleHideSidebar} />
            <SidebarLink title="CT-Scan" route="/patient-data/input/ct-scan" onClick={handleHideSidebar} />
            <SidebarLink title="Blood Test" route="/patient-data/input/bloodtest" onClick={handleHideSidebar} />
            <SidebarLink title="PCR/Antigen Swab Test" route="/patient-data/input/pcr" onClick={handleHideSidebar} />
            <SidebarLink title="Vital Sign Reading" route="/patient-data/input/vsr" onClick={handleHideSidebar} />
            <SidebarLink title="Others" route="/patient-data/listing/others" onClick={handleHideSidebar} />
          </SidebarCategory>
        </ul>
      ) : (
        ''
      )}

      {/* Doctor */}
      {roleUser === 'Doctor' ? (
        <ul className="sidebar__block">
          <SidebarLink title="Dashboard" icon="home" route="/doctor/index" onClick={handleHideSidebar} />
          <SidebarCategory title="Input" icon="enter-down">
            <SidebarLink title="CXR" route="/patient-data/input/cxr" onClick={handleHideSidebar} />
            <SidebarLink title="CT-Scan" route="/patient-data/input/ct-scan" onClick={handleHideSidebar} />
            <SidebarLink title="Blood Test" route="/patient-data/input/bloodtest" onClick={handleHideSidebar} />
            <SidebarLink title="PCR/Antigen Swab Test" route="/patient-data/input/pcr" onClick={handleHideSidebar} />
            <SidebarLink title="Vital Sign Reading" route="/patient-data/input/vsr" onClick={handleHideSidebar} />
            <SidebarLink title="Others" route="/patient-data/listing/others" onClick={handleHideSidebar} />
          </SidebarCategory>
        </ul>
      ) : (
        ''
      )}

      {/* Hospital Admin */}
      {roleUser === 'Hospital Admin' ? (
        <ul className="sidebar__block">
          <SidebarLink title="Dashboard" icon="home" route="/hospital/index" onClick={handleHideSidebar} />
          <SidebarLink title="Patient Data" icon="user" route="/hospital/patient/list" onClick={handleHideSidebar} />
          <SidebarCategory title="Input" icon="enter-down">
            <SidebarLink title="CXR" route="/patient-data/input/cxr" onClick={handleHideSidebar} />
            <SidebarLink title="CT-Scan" route="/patient-data/input/ct-scan" onClick={handleHideSidebar} />
            <SidebarLink title="Blood Test" route="/patient-data/input/bloodtest" onClick={handleHideSidebar} />
            <SidebarLink title="PCR/Antigen Swab Test" route="/patient-data/input/pcr" onClick={handleHideSidebar} />
            <SidebarLink title="Vital Sign Reading" route="/patient-data/input/vsr" onClick={handleHideSidebar} />
            <SidebarLink title="Others" route="/patient-data/listing/others" onClick={handleHideSidebar} />
          </SidebarCategory>
          <SidebarCategory icon="apartment" title="Room Management">
            <SidebarLink title="Building" route="/hospital/building" onClick={handleHideSidebar} />
            <SidebarLink title="Room" route="/hospital/room" onClick={handleHideSidebar} />
            <SidebarLink title="Bed" route="/hospital/bed" onClick={handleHideSidebar} />
          </SidebarCategory>
        </ul>
      ) : (
        ''
      )}

      {/* Hospital Management */}
      {roleUser === 'Hospital Management' ? (
        <ul className="sidebar__block">
          <SidebarLink title="Dashboard" icon="home" route="/management/index" onClick={handleHideSidebar} />
        </ul>
      ) : (
        ''
      )}
    </div>
  );
};

SidebarContent.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default SidebarContent;
