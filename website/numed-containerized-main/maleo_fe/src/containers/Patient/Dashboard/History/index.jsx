/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row } from 'reactstrap';
import HistoryTable from './components/HistoryTable';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN } from '../../../../utils/Types';
import { PATIENT_ACTIVITIES } from '../../../../utils/EndPoints';

const History = () => {
const [historyActivity, sethistoryActivity] = useState([]);
const listDataTable = CreateTableData(historyActivity);
useEffect(() => {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  axios.get(PATIENT_ACTIVITIES, options)
    .then((res) => {
      sethistoryActivity(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);

  return (
    <Container>
      <Row>
        <HistoryTable listDataTable={listDataTable} />
      </Row>
    </Container>
  );
  };
export default History;
