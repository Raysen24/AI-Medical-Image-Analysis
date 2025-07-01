/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
 Container, Row, ButtonToolbar, Button,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import UserManagementTable from './components/BuildingTable';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { BUILDING_MANAGEMENT } from '../../../../../utils/EndPoints';

const BuildingList = () => {
  const history = useHistory();
const [building, setBuilding] = useState([]);
const listDataTable = CreateTableData(building);
useEffect(() => {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  axios.get(BUILDING_MANAGEMENT, options)
    .then((res) => {
      setBuilding(res.data);
    })
    .catch((err) => {
      console.log(err);
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
        <UserManagementTable listDataTable={listDataTable} />
      </Row>
    </Container>
  );
  };
export default BuildingList;
