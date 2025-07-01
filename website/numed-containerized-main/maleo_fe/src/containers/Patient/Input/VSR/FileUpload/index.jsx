/* eslint-disable no-console */
import React from 'react';
import {
  Container, ButtonToolbar, Button,
} from 'reactstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ManualInnputVSRTestForm from './components/ManualInnputVSRTestForm';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { VITAL_SIGN } from '../../../../../utils/EndPoints';

const VSRFileUpload = () => {
  const history = useHistory();
  const onSubmit = (e) => {
    // setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append('patient_id', [e.target.patient_id][0].value);
    data.append('upload_by', [e.target.upload_by][0].value);
    data.append('hospital_id', [e.target.hospital_id][0].value);
    data.append('blood_pressure', [e.target.blood_pressure][0].value);
    data.append('respirotary_rate', [e.target.respirotary_rate][0].value);
    data.append('saturate', [e.target.saturate][0].value);
    data.append('temperature', [e.target.temperature][0].value);
    data.append('heart_rate', [e.target.heart_rate][0].value);
    data.append('oxy_aid', 'None');

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.post(VITAL_SIGN, data, options)
      .then(() => {
        // console.log('es', res.data.id);
        history.push({
          pathname: '/patient-data/input/vsr',
        });
        // setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // setLoading(false);
      });
  };
  return (
    <Container className="dashboard">
      <ButtonToolbar className="form__button-toolbar">
        <Button color="primary" onClick={history.goBack}>
          Back
        </Button>
      </ButtonToolbar>
      <ManualInnputVSRTestForm handleSubmit={(e) => onSubmit(e)} />

    </Container>
  );
};
export default VSRFileUpload;
