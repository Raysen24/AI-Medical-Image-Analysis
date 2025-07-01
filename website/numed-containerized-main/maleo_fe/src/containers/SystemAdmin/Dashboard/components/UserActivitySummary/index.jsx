/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Container, Row, Spinner } from 'reactstrap';
import axios from 'axios';
import UserActivitySummaryTable from './components/UserActivitySummaryTable';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { HISTORYSYSTEM_ALL } from '../../../../../utils/EndPoints';

const UserActivitySummary = () => {
  const [historySystemAll, setHistorySystemAll] = useState([]);
  const listDataTable = CreateTableData(historySystemAll);
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
    axios.get(HISTORYSYSTEM_ALL, options)
      .then((res) => {
        setHistorySystemAll(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      {isLoading ? <Spinner /> : (
        <Row>
          <UserActivitySummaryTable listDataTable={listDataTable} />
        </Row>
      )}
    </Container>
  );
  };
export default UserActivitySummary;
