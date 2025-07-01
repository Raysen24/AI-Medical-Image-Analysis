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
import UserManagementTable from './components/ListCXR';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import { PATIENT_PCRSWAB } from '../../../../../../utils/EndPoints';

const PCRList = () => {
  const history = useHistory();
  const params = useParams();
  const [pcrantigenswab, setPCRSWAB] = useState([]);
  const listDataTable = CreateTableData(pcrantigenswab);
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
    axios
      .get(`${PATIENT_PCRSWAB}${params.id}/`, options)
      .then((res) => {
        setPCRSWAB(res.data);
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
export default PCRList;
