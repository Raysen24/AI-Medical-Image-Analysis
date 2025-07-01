/* eslint-disable no-shadow */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { Container, ButtonToolbar, Button } from 'reactstrap';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import ManualInputPCRSWABForm from './components/ManualInputPCRSWABForm';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../../utils/Types';
import { PCRANTIGENTSWAB_MEDICALRECORD } from '../../../../../../utils/EndPoints';

const BloodTestFileUpload = () => {
  const history = useHistory();
  const params = useParams();
  const [isLoading, setLoading] = useState(false);
  const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append('hospital_id', [e.target.hospital_id][0].value);
    data.append('patient_id', params.id);
    data.append('upload_by', userDetail.id);
    data.append('category', [e.target.category][0].value);
    if ([e.target.category][0].value === 'Antigen Swab') {
      data.append('date_swab', [e.target.date_swab][0].value);
      data.append('parameter_swab', [e.target.parameter_swab][0].value);
      data.append('metode_swab', [e.target.metode_swab][0].value);
      data.append('result_swab', [e.target.result_swab][0].value);
      data.append('date_pcr', '');
      data.append('parameter_1_pcr', '');
      data.append('parameter_2_pcr', '');
      data.append('parameter_3_pcr', '');
      data.append('metode_1_pcr', '');
      data.append('metode_2_pcr', '');
      data.append('metode_3_pcr', '');
      data.append('normal_range_1_pcr', '');
      data.append('normal_range_2_pcr', '');
      data.append('normal_range_3_pcr', '');
      data.append('result_1_pcr', '');
      data.append('result_2_pcr', '');
      data.append('result_3_pcr', '');
    } else {
      data.append('date_swab', '');
      data.append('parameter_swab', '');
      data.append('metode_swab', '');
      data.append('result_swab', '');
      data.append('date_pcr', [e.target.date_pcr][0].value);
      data.append('parameter_1_pcr', [e.target.parameter_1_pcr][0].value);
      data.append('parameter_2_pcr', [e.target.parameter_2_pcr][0].value);
      data.append('parameter_3_pcr', [e.target.parameter_3_pcr][0].value);
      data.append('metode_1_pcr', [e.target.metode_1_pcr][0].value);
      data.append('metode_2_pcr', [e.target.metode_2_pcr][0].value);
      data.append('metode_3_pcr', [e.target.metode_3_pcr][0].value);
      data.append('normal_range_1_pcr', [e.target.normal_range_1_pcr][0].value);
      data.append('normal_range_2_pcr', [e.target.normal_range_2_pcr][0].value);
      data.append('normal_range_3_pcr', [e.target.normal_range_3_pcr][0].value);
      data.append('result_1_pcr', [e.target.result_1_pcr][0].value);
      data.append('result_2_pcr', [e.target.result_2_pcr][0].value);
      data.append('result_3_pcr', [e.target.result_3_pcr][0].value);
    }

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios
      .post(PCRANTIGENTSWAB_MEDICALRECORD, data, options)
      .then((e) => {
        history.push({
          pathname: `/input/resultpcr/${e.data.id}`,
          state: { data: e.data },
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
          Back
        </Button>
      </ButtonToolbar>
      <ManualInputPCRSWABForm handleSubmit={(e) => onSubmit(e)} />
    </Container>
  );
};

export default BloodTestFileUpload;
