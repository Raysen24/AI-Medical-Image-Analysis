/* eslint-disable no-console */
import React, { useState } from 'react';
import {
  Container, Row, ButtonToolbar, Button,
} from 'reactstrap';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import PatientData from './components/PatientData';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../../utils/Types';
import { PATIENT_MONITORING } from '../../../../../../utils/EndPoints';

const NewMonitoringPatient = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = useParams();
  const [isLoading, setLoading] = useState(false);
  // get user detail
  const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append('created_at', [e.target.created_at][0].value);
    data.append('patient_id', [e.target.patient_id][0].value);
    data.append('created_by', [e.target.created_by][0].value);
    data.append('oxygen_aid', [e.target.oxygen_aid][0].value);
    data.append('fall_score', [e.target.fall_score][0].value);
    data.append('ews_score', [e.target.ews_score][0].value);
    if (userDetail.role === 'Nurse') {
      data.append('update_date_nurse', moment(new Date()).format('YYYY-MM-DD'));
      data.append('nurse_notes', [e.target.nurse_notes][0].value);
    }
    if (userDetail.role === 'Doctor') {
      data.append('update_date_doctor', moment(new Date()).format('YYYY-MM-DD'));
      data.append('doctor_notes', [e.target.doctor_notes][0].value);
      data.append('decision', [e.target.decision][0].value);
    }

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.post(PATIENT_MONITORING, data, options)
      .then(() => {
        // window.location.reload();
        history.push({
          pathname: `/patient-data/list-monitoring/${params.id}`,
          // pathname: `/nurse/monitoring/list/${params.id}`,
          // state: { data: listingAttendance },
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  if (isLoading) {
    return (
      <div className="load">
        <div className="load__icon-wrap">
          <svg className="load__icon">
            <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
          </svg>
        </div>
      </div>
    );
  }
  return (
    <Container className="dashboard">
      <ButtonToolbar className="form__button-toolbar">
        <Button color="primary" onClick={history.goBack}>
          {t('ui.btn.back')}
        </Button>
      </ButtonToolbar>
      <Row>
        <PatientData
          handleSubmit={(e) => onSubmit(e)}
        />
      </Row>
    </Container>
  );
};

export default (NewMonitoringPatient);
