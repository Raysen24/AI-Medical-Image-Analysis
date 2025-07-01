/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
 Container, Col, Row, Button, ButtonToolbar,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import UserManagementTable from './components/ListMRPatient';
import CreateTableData from './components/CreateData';
import { LOCALSTORAGE_TOKEN } from '../../../../utils/Types';
import { PATIENT_MEDICALRECORD_BYID } from '../../../../utils/EndPoints';

const MedicalRecordPatientList = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = useParams();
  const [patientMedicalRecord, setpatientMedicalRecord] = useState([]);
  const listDataTable = CreateTableData(patientMedicalRecord);
  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(`${PATIENT_MEDICALRECORD_BYID}${params.id}/`, options)
      .then((res) => {
        console.log('res', res.data[0]);
        setpatientMedicalRecord(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <ButtonToolbar className="form__button-toolbar">
            <Button color="primary" onClick={history.goBack}>
              {t('ui.btn.back')}
            </Button>
          </ButtonToolbar>
        </Col>
        <Col md={12} style={{ padding: 'none' }}>
          <h3 className="page-title">{t('patient.medical_record.page_title')}</h3>
        </Col>
      </Row>
      <Row>
        <UserManagementTable listDataTable={listDataTable} />
      </Row>
    </Container>
  );
  };
export default MedicalRecordPatientList;
