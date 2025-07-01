/* eslint-disable no-shadow */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { Container, ButtonToolbar, Button } from 'reactstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ManualInputPCRSWABForm from './components/ManualInputPCRSWABForm';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../utils/Types';
import { PCRANTIGENTSWAB_MEDICALRECORD } from '../../../../../utils/EndPoints';

const BloodTestFileUpload = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append('date', e.target.date.value);
    if (userDetail.role === 'Patient') {
      data.append('patient_id', userDetail.id);
    } else {
      data.append('patient_id', e.target.patient_id.value);
    }
    data.append('hospital_id', e.target.hospital_id.value);
    data.append('upload_by', userDetail.id);
    data.append('category', e.target.category.value);
    data.append('result', e.target.result.value);
    data.append('ct_value', e.target.ctvalue.value);

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios
      .post(PCRANTIGENTSWAB_MEDICALRECORD, data, options)
      .then(() => {
        history.push({
          pathname: '/patient-data/input/pcr',
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
      <ManualInputPCRSWABForm handleSubmit={(e) => onSubmit(e)} />
    </Container>
  );
};

export default BloodTestFileUpload;
