/* eslint-disable no-shadow */
/* eslint-disable no-console */
import React, { useState } from 'react';
import {
  Col, Container, Progress, Card, ButtonToolbar, Button,
} from 'reactstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import FileUploadCXRForm from './components/FileUploadCXRForm';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { CXR_MEDICALRECORD } from '../../../../../utils/EndPoints';

const CXRFileUpload = () => {
  const history = useHistory();
  const { t } = useTranslation('common');
  const [progress, setProgress] = useState();
  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('patient_id', [e.target.patient_id][0].value);
    data.append('upload_by', [e.target.upload_by][0].value);
    if ([e.target.image][0].files[0]) {
      data.append('image', [e.target.image][0].files[0]);
    }
    data.append('hospital_id', [e.target.hospital_id][0].value);
    // console.log([e.target.patient_id][0].value, 'data', [e.target.upload_by][0].value);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      onUploadProgress: (data) => {
        setProgress(Math.round((100 * data.loaded) / data.total));
      },
    };
    axios.post(CXR_MEDICALRECORD, data, options)
      .then((e) => {
        // window.location.reload();
        // console.log('e', e.data.id);
        history.push({
          pathname: `/input/result/cxr/${e.data.id}`,
          state: { data: e.data },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container className="dashboard">
      <ButtonToolbar className="form__button-toolbar">
        <Button color="primary" onClick={history.goBack}>
          {t('ui.btn.back')}
        </Button>
      </ButtonToolbar>

      <Card>
        <Col md={12} lg={12}>
          <Progress animated value={progress} />
        </Col>
      </Card>
      <FileUploadCXRForm
        handleSubmit={(e) => onSubmit(e)}
      />
    </Container>
  );
};

export default CXRFileUpload;
