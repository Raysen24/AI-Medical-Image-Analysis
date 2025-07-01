/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import {
 Container, Col, Row, Spinner,
} from 'reactstrap';
import UserManagementTable from './components/HospitalDetailTable';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { HOSPITAL_DETAIL } from '../../../../../utils/EndPoints';

const Hospital = () => {
  const { t } = useTranslation('common');
  const [userManagement, setuserManagement] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const listDataTable = CreateTableData(userManagement);
  // console.log(params);
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(HOSPITAL_DETAIL, options)
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
          <h3 className="page-title">{t('system_admin.system_admin.hospital')}</h3>
        </Col>
      </Row>
      <Row>
        {isLoading ? <Spinner /> : (
          <UserManagementTable listDataTable={listDataTable} />
        )}
      </Row>
    </Container>
  );
  };
export default Hospital;
