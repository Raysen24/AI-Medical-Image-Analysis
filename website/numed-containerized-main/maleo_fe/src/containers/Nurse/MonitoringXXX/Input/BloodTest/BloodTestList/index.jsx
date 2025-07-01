/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
 Container, Row, ButtonToolbar, Button,
} from 'reactstrap';
import { useParams, useHistory } from 'react-router-dom';
import UserManagementTable from './components/ListBloodTest';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import { PATIENT_BLOODTEST } from '../../../../../../utils/EndPoints';

const BloodTestList = () => {
  const history = useHistory();
  const params = useParams();
  const [bloodTest, setbloodTest] = useState([]);
  const listDataTable = CreateTableData(bloodTest);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(`${PATIENT_BLOODTEST}${params.id}`, options)
      .then((res) => {
        setbloodTest(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
}, []);

  return (
    <Container className="dashboard">
      <ButtonToolbar className="form__button-toolbar">
        <Button color="primary" onClick={history.goBack}>
          Back
        </Button>
      </ButtonToolbar>
      <Row>
        <UserManagementTable
          listDataTable={listDataTable}
          isLoading={isLoading}
        />
      </Row>
    </Container>
  );
  };
export default BloodTestList;
