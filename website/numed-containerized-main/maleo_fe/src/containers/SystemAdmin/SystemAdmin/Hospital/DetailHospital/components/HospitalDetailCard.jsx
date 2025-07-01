import React from 'react';
import {
  Card, CardBody, Col,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import HospitalDetailtForm from './HospitalDetailtForm';

const HospitalDetailCard = () => {
  const { t } = useTranslation('common');
  return (
    <Col md={12} lg={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">{t('system_admin.system_admin.hospital_detail')}</h5>
            <div className="products-list__btn-toolbar-top" />
          </div>
          <HospitalDetailtForm />
        </CardBody>
      </Card>
    </Col>
  );
};
export default HospitalDetailCard;
