/* eslint-disable max-len */
import React from 'react';
import {
  Col, Container, Row,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import PatientDetailInformation from './component/PatientDetailInformation';
import CTScan from './component/CTScan';
import BloodTest from './component/BloodTest';
import PCR from './component/PCR';
import VSR from './component/VSR';
import CXR from './component/CXR';
import ListMonitoring from './component/ListMonitoring';

const MonitoringListPatient = () => {
  const { t } = useTranslation('common');
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">{t('patient.detail.monitoring')}</h3>
        </Col>
      </Row>
      <Row>
        <PatientDetailInformation />
      </Row>
      <Row>
        <ListMonitoring />
        <CXR />
        <CTScan />
        <BloodTest />
        <PCR />
        <VSR />
      </Row>
    </Container>
  );
};

export default MonitoringListPatient;
