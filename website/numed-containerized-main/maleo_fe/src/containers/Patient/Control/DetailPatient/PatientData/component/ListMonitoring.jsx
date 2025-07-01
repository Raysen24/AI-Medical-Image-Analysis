/* eslint-disable react/self-closing-comp */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React from 'react';
import {
  Col, CardBody, Card, ButtonToolbar, Button,
} from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';

const MonitoringListHandler = (history, info) => {
  history.push({
    pathname: `/patient-data/list-monitoring/${info}`,
    state: { data: info },
  });
};

const ListMonitoring = () => {
  const history = useHistory();
  const params = useParams();
  return (
    <Col md={12} xl={4} lg={6} xs={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="dashboard__booking-total-container">
            <h5 className="dashboard__booking-total-title2 dashboard__booking-total-title2--blue">
              Monitoring List
            </h5>
          </div>
          {/* <h5 className="dashboard__booking-total-description">Last Upload : dd/mm/yyyy</h5> */}
          <div className="progress-wrap progress-wrap--small progress-wrap--lime-gradient progress-wrap--rounded">
            <p className="dashboard__booking-card-progress-label progress__label">.</p>
            <ButtonToolbar className="products-list__btn-toolbar-top">
              <Button
                size="sm"
                color="primary"
                onClick={() => MonitoringListHandler(history, params.id)}
              > Detail
              </Button>
            </ButtonToolbar>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ListMonitoring;
