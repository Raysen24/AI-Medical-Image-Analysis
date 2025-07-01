/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React from 'react';
import {
  Col, CardBody, Card, Button, ButtonToolbar,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';

const userDetail = (history, info) => {
  history.push({
    pathname: `/patient-data/detail/${info.id}`,
    state: { data: info },
  });
};
const PatientDetailInformation = () => {
  const history = useHistory();
  // const params = useParams();
  const { location } = history;
  const { state } = location;
  const { data } = state;
  // console.log(data);
  return (
    <Col md={12} xl={12} lg={6} xs={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="dashboard__booking-total-container">
            <h5 className="dashboard__booking-total-title dashboard__booking-total-title--blue">
              {data.fullname}
            </h5>
            {/* <div className="dashboard__competitor-img">
              <img src={Ava1} alt="" />
            </div> */}
          </div>
          <h5 className="dashboard__booking-total-description">MR.ID : {data.mr_id_patient}</h5>
          <div className="progress-wrap progress-wrap--small progress-wrap--lime-gradient progress-wrap--rounded">
            <p className="dashboard__booking-card-progress-label progress__label">.</p>
            <ButtonToolbar className="products-list__btn-toolbar-top">
              <Button size="sm" color="success" onClick={() => userDetail(history, data)}>Detail</Button>
            </ButtonToolbar>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default PatientDetailInformation;
