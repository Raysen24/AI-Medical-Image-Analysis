/* eslint-disable no-shadow */
/* eslint-disable no-console */
import React, { useState } from 'react';
import {
  Container, ButtonToolbar, Button,
} from 'reactstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ManualInputBloodTestForm from './components/ManualInputBloodTestForm';
import { LOCALSTORAGE_TOKEN } from '../../../../../../../utils/Types';
import { BLOODTEST_MEDICALRECORD } from '../../../../../../../utils/EndPoints';

const BloodTestFileUpload = () => {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    if ([e.target.medical_id][0].value) {
      data.append('medical_id', [e.target.medical_id][0].value);
    }
    data.append('hospital_id', [e.target.hospital_id][0].value);
    data.append('patient_id', [e.target.patient_id][0].value);
    data.append('upload_by', [e.target.upload_by][0].value);
    data.append('basofil', [e.target.basofil][0].value);
    data.append('cl', [e.target.cl][0].value);
    data.append('creat', [e.target.creat][0].value);
    data.append('eos', [e.target.eos][0].value);
    data.append('eri', [e.target.eri][0].value);
    data.append('gsdfull', [e.target.gsdfull][0].value);
    data.append('hb', [e.target.hb][0].value);
    data.append('hct', [e.target.hct][0].value);
    data.append('k', [e.target.k][0].value);
    data.append('leko', [e.target.leko][0].value);
    data.append('limfosit', [e.target.limfosit][0].value);
    data.append('mch', [e.target.mch][0].value);
    data.append('mchc', [e.target.mchc][0].value);
    data.append('mcv', [e.target.mcv][0].value);
    data.append('monosit', [e.target.monosit][0].value);
    data.append('na', [e.target.na][0].value);
    data.append('neutb', [e.target.neutb][0].value);
    data.append('nlr1', [e.target.nlr1][0].value);
    data.append('plt', [e.target.plt][0].value);
    data.append('rdw', [e.target.rdw][0].value);
    data.append('segmen', [e.target.segmen][0].value);
    data.append('sgot', [e.target.sgot][0].value);
    data.append('sgpt', [e.target.sgpt][0].value);
    data.append('ureum', [e.target.ureum][0].value);
    data.append('led', [e.target.led][0].value);
    data.append('bildirek', [e.target.bildirek][0].value);
    data.append('bilindir', [e.target.bilindir][0].value);
    data.append('biltot', [e.target.biltot][0].value);
    data.append('hco3_n', [e.target.hco3_n][0].value);
    data.append('o2s_n', [e.target.o2s_n][0].value);
    data.append('pco2_n', [e.target.pco2_n][0].value);
    data.append('ph_nu', [e.target.ph_nu][0].value);
    data.append('po2_n', [e.target.po2_n][0].value);
    data.append('tco2_n', [e.target.tco2_n][0].value);
    data.append('ptinr', [e.target.ptinr][0].value);
    data.append('bjurin', [e.target.bjurin][0].value);
    data.append('phurin', [e.target.phurin][0].value);
    data.append('choles', [e.target.choles][0].value);
    data.append('gdpfull', [e.target.gdpfull][0].value);
    data.append('gdppfull', [e.target.gdppfull][0].value);
    data.append('hdlcho', [e.target.hdlcho][0].value);
    data.append('ldlcho', [e.target.ldlcho][0].value);
    data.append('trigl', [e.target.trigl][0].value);
    data.append('ua', [e.target.ua][0].value);
    data.append('tshsnew', [e.target.tshsnew][0].value);
    data.append('albcp', [e.target.albcp][0].value);
    data.append('tp', [e.target.tp][0].value);
    data.append('t4', [e.target.t4][0].value);
    data.append('caltot', [e.target.caltot][0].value);
    data.append('mg', [e.target.mg][0].value);
    data.append('glurapid', [e.target.glurapid][0].value);
    data.append('hdld', [e.target.hdld][0].value);
    data.append('alp', [e.target.alp][0].value);
    data.append('ggt', [e.target.ggt][0].value);
    data.append('glob', [e.target.glob][0].value);
    data.append('ldh', [e.target.ldh][0].value);
    data.append('ft4', [e.target.ft4][0].value);
    data.append('lakt_dr', [e.target.lakt_dr][0].value);
    data.append('acp001', [e.target.acp001][0].value);
    data.append('acp002', [e.target.acp002][0].value);
    data.append('acp009', [e.target.acp009][0].value);
    data.append('cglu', [e.target.cglu][0].value);
    data.append('cldh', [e.target.cldh][0].value);
    data.append('cprot', [e.target.cprot][0].value);
    data.append('sglu', [e.target.sglu][0].value);
    data.append('sldh', [e.target.sldh][0].value);
    data.append('sprot', [e.target.sprot][0].value);
    data.append('aca001', [e.target.aca001][0].value);
    data.append('aca002', [e.target.aca002][0].value);
    data.append('aca009', [e.target.aca009][0].value);
    data.append('cglua', [e.target.cglua][0].value);
    data.append('cldha', [e.target.cldha][0].value);
    data.append('cprota', [e.target.cprota][0].value);
    data.append('sglua', [e.target.sglua][0].value);
    data.append('sldha', [e.target.sldha][0].value);
    data.append('sprota', [e.target.sprota][0].value);
    data.append('tgl_lahir', [e.target.tgl_lahir][0].value);

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.post(BLOODTEST_MEDICALRECORD, data, options)
      .then((e) => {
        history.push({
          pathname: `/input/result/bloodtest/${e.data.id}`,
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
      <ManualInputBloodTestForm
        handleSubmit={(e) => onSubmit(e)}
      />
    </Container>

  );
};

export default BloodTestFileUpload;
