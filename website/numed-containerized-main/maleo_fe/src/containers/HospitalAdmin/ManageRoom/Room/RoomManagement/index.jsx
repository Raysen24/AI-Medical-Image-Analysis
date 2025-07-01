/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
 Container, Col, Row, ButtonToolbar, Button,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import UserManagementTable from './components/RoomManagementTable';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { ROOM_MANAGEMENT } from '../../../../../utils/EndPoints';

const KelasList = () => {
  const history = useHistory();
const [userManagement, setuserManagement] = useState([]);
const listDataTable = CreateTableData(userManagement);
useEffect(() => {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  axios.get(ROOM_MANAGEMENT, options)
    .then((res) => {
      setuserManagement(res.data);
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
export default KelasList;
