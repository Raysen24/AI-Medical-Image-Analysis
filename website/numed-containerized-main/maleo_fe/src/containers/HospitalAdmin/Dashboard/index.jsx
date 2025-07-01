/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Col, Container, Row,
} from 'reactstrap';
import EWSSummary from './EWSSummary/index';
import PatientAlertCard from './PatientAlert/PatientAlertCard';
import PatientSummaryList from './PatientSummaryList/index';
import RoomCapacity from './RoomCapacity/index';
import { LOCALSTORAGE_USERDETAIL } from '../../../utils/Types';

const DashboardHospitalAdmin = () => {
  const localdata = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
  return (
    <Container className="dashboard">
      <Col md={12} xl={12} lg={12} xs={12}>
        <Row>
          <Col md={12}>
            <h3 className="page-title">
              Dashboard {localdata ? localdata.hospital_list[0].name : 'Hospital'}
            </h3>
          </Col>
        </Row>
        <Row>
          <RoomCapacity />
          <PatientAlertCard />
        </Row>
        <Row>
          <EWSSummary />
          <PatientSummaryList />
        </Row>
      </Col>
    </Container>
  );
};

export default (DashboardHospitalAdmin);
