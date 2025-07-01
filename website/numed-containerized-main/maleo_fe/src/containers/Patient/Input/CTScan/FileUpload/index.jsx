/* eslint-disable no-shadow */
/* eslint-disable no-console */
import React, { useState } from 'react';
import {
  Col, Container, Progress, Card, ButtonToolbar, Button,
} from 'reactstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import CTScanFileUploadForm from './components/CTScanFileUploadForm';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { CTSCAN_MEDICALRECORD } from '../../../../../utils/EndPoints';

const CTScanFileUpload = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  // const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState();

  const onSubmit = (e) => {
    // setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append('patient_id', [e.target.patient_id][0].value);
    data.append('upload_by', [e.target.upload_by][0].value);
    if ([e.target.image][0].files[0]) {
      data.append('image', [e.target.image][0].files[0]);
    }
    data.append('hospital_id', [e.target.hospital_id][0].value);
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
    axios.post(CTSCAN_MEDICALRECORD, data, options)
      .then((e) => {
        // console.log('e', e);
        history.push({
          pathname: `/input/result/ctscan/${e.data.id}`,
          state: { data: e.data },
        });
        // setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // setLoading(false);
      });
  };

  // if (isLoading) {
  //   return (
  //     <div className="load">
  //       <div className="load__icon-wrap">
  //         <svg className="load__icon">
  //           <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
  //         </svg>
  //       </div>
  //     </div>
  //   );
  // }
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
      <CTScanFileUploadForm
        handleSubmit={(e) => onSubmit(e)}
      />
    </Container>
  );
};

export default CTScanFileUpload;
