import React from 'react';
import {
  Card, CardBody, Col,
} from 'reactstrap';
import DetailProducts from './PaymentForm';

const PaymentCard = () => (
  <Col md={12} lg={12}>
    <Card>
      <CardBody className="dashboard__booking-card">
        <div className="card__title">
          <h5 className="bold-text">Building Detail Information</h5>
          <div className="products-list__btn-toolbar-top" />
        </div>
        <DetailProducts />
      </CardBody>
    </Card>
  </Col>
);

export default PaymentCard;
