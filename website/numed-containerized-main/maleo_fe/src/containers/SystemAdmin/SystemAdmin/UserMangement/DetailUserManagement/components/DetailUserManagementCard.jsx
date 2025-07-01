import React from 'react';
import {
  Card, CardBody, Col,
} from 'reactstrap';
import DetailUserManagementForm from './DetailUserManagementForm';

const DetailUserManagementCard = () => (
  <Col md={12} lg={12}>
    <Card>
      <CardBody className="dashboard__booking-card">
        <div className="card__title">
          <h5 className="bold-text">User Management Detail</h5>
          <div className="products-list__btn-toolbar-top" />
        </div>
        <DetailUserManagementForm />
      </CardBody>
    </Card>
  </Col>
);

export default DetailUserManagementCard;
