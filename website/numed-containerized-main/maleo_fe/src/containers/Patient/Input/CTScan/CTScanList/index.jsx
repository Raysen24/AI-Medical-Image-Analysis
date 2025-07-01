/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
 Container, Row, ButtonToolbar, Button,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import UserManagementTable from './components/ListCTScan';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { CTSCAN_MEDICALRECORD } from '../../../../../utils/EndPoints';

const CTScanList = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const [ctSacn, setctSacn] = useState([]);
  const listDataTable = CreateTableData(ctSacn);
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
    axios.get(CTSCAN_MEDICALRECORD, options)
      .then((res) => {
        setctSacn(res.data);
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
          {t('ui.btn.back')}
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
export default CTScanList;
