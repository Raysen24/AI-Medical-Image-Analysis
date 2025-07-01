/* eslint-disable max-len */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React from 'react';
import {
  Col, CardBody, Card, ButtonToolbar, Button,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';

const userDetail = (history, info) => {
  history.push({
    pathname: `/patient-data/listing/vsr/${info.id}`,
    state: { data: info },
  });
};
const VSR = () => {
  const history = useHistory();
  const { location } = history;
  const { state } = location;
  const { data } = state;
  return (
    <Col md={12} xl={4} lg={6} xs={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="dashboard__booking-total-container">
            <h5 className="dashboard__booking-total-title2 dashboard__booking-total-title2--blue">Vital Sign Reading</h5>
          </div>
          <h5 className="dashboard__booking-total-description">Last Upload : dd/mm/yyyy</h5>
          <div className="progress-wrap progress-wrap--small progress-wrap--lime-gradient progress-wrap--rounded">
            <p className="dashboard__booking-card-progress-label progress__label">.</p>
            <ButtonToolbar className="products-list__btn-toolbar-top">
              <Button size="sm" color="success" onClick={() => userDetail(history, data)}>
                Detail
              </Button>
            </ButtonToolbar>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default VSR;
