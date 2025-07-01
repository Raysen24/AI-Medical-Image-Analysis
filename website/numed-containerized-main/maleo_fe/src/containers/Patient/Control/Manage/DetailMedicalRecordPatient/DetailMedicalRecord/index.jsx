import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'reactstrap';
import PatientDataDetail from './components/PatientDataDetail';

const DetailMedicalRecordPatient = () => {
  const { t } = useTranslation('common');
  return (
    <Container>
      <Row>
        <Col md={12}>
          <h3 className="page-title">{t('patient.medical_record.detail_title')}</h3>
        </Col>
      </Row>
      <Row>
        <PatientDataDetail />
      </Row>
    </Container>
  );
};
export default (DetailMedicalRecordPatient);
