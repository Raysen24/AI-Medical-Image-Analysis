/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Col, Row } from 'reactstrap';
import PatientListable from './components/PatientListable';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../utils/Types';
import { PATIENT_HOSPITAL } from '../../../utils/EndPoints';

const HAListingDataPatients = () => {
const [userManagement, setuserManagement] = useState([]);
const listDataTable = CreateTableData(userManagement);
const [isLoading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  const userdetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  axios.get(`${PATIENT_HOSPITAL}/${userdetail.hospital}`, options)
    .then((res) => {
      setuserManagement(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    });
}, []);

  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Data Patient</h3>
        </Col>
      </Row>
      <Row>
        <PatientListable
          listDataTable={listDataTable}
          isLoading={isLoading}
        />
      </Row>
    </Container>
  );
  };
export default HAListingDataPatients;
