/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Container, Col, Row } from 'reactstrap';
import UserManagementTable from './components/DoctorTable';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../utils/Types';
import { PATIENT_HOSPITAL } from '../../../utils/EndPoints';

const DashboardDoctors = () => {
  const { t } = useTranslation('common');
  const [userManagement, setuserManagement] = useState([]);
  const listDataTable = CreateTableData(userManagement);
  const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(`${PATIENT_HOSPITAL}/${userDetail.hospital}`, options)
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
        <Col md={12}>
          <h3 className="page-title">{t('doctor.page_title')}</h3>
        </Col>
      </Row>
      <Row>
        <UserManagementTable listDataTable={listDataTable} />
      </Row>
    </Container>
  );
  };
export default DashboardDoctors;
