/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
 Container, Col, Row, Spinner,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import UserManagementTable from './components/UserManagementTable';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { USERS_ALL } from '../../../../../utils/EndPoints';

const UserManagement = () => {
  const { t } = useTranslation('common');
  const [userManagement, setuserManagement] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const listDataTable = CreateTableData(userManagement);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    // console.log('user management', USERS_ALL);
    axios.get(USERS_ALL, options)
      .then((res) => {
        // console.log('res data', res.data);
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
          <h3 className="page-title">{t('system_admin.system_admin.page_title')}</h3>
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
export default UserManagement;
