/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Col, Row } from 'reactstrap';
import UserManagementTable from './components/HospitalTable';
import CreateTableData from './components/CreateData';
import {
  LOCALSTORAGE_TOKEN,
  LOCALSTORAGE_USERDETAIL,
} from '../../../../utils/Types';
import { PATIENT_HOSPITAL } from '../../../../utils/EndPoints';

const KelasList = () => {
  const [userManagement, setuserManagement] = useState([]);
  const listDataTable = CreateTableData(userManagement);
  // console.log(params);
  useEffect(() => {
    const userdetail = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_USERDETAIL),
    );
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios
      .get(`${PATIENT_HOSPITAL}/${userdetail.hospital}`, options)
      .then((res) => {
        setuserManagement(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container className="dashboard">
      <Row>
        <UserManagementTable listDataTable={listDataTable} />
      </Row>
    </Container>
  );
};
export default KelasList;
