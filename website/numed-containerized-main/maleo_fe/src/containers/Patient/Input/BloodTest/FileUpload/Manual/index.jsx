/* eslint-disable no-shadow */
/* eslint-disable no-console */
import React, { useState } from 'react';
import { Container, ButtonToolbar, Button } from 'reactstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ManualInputBloodTestForm from './components/ManualInputBloodTestForm';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import { BLOODTEST_MEDICALRECORD } from '../../../../../../utils/EndPoints';

const BloodTestFileUpload = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);

  const onSubmit = (e) => {
    // console.log(e.target.upload_by);
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append('hospital_id', [e.target.hospital_id][0].value);
    data.append('patient_id', [e.target.patient_id][0].value);
    data.append('upload_by', [e.target.upload_by][0].value);
    data.append('basofil', [e.target.basofil][0].value);
    data.append('cl', 95);
    data.append('creat', [e.target.creat][0].value);
    data.append('eos', [e.target.eos][0].value);
    data.append('eri', [e.target.eri][0].value);
    data.append('gsdfull', [e.target.gsdfull][0].value);
    data.append('hb', [e.target.hb][0].value);
    data.append('hct', [e.target.hct][0].value);
    data.append('k', 3.5);
    data.append('leko', [e.target.leko][0].value);
    data.append('limfosit', [e.target.limfosit][0].value);
    data.append('mch', [e.target.mch][0].value);
    data.append('mchc', [e.target.mchc][0].value);
    data.append('mcv', [e.target.mcv][0].value);
    data.append('monosit', [e.target.monosit][0].value);
    data.append('na', 135);
    data.append('neutb', [e.target.neutb][0].value);
    data.append('nlr1', [e.target.nlr1][0].value);
    data.append('plt', [e.target.plt][0].value);
    data.append('rdw', [e.target.rdw][0].value);
    data.append('segmen', [e.target.segmen][0].value);
    data.append('sgot', [e.target.sgot][0].value);
    data.append('sgpt', [e.target.sgpt][0].value);
    data.append('ureum', [e.target.ureum][0].value);
    data.append('led', [e.target.led][0].value);
    data.append('bildirek', 0);
    data.append('bilindir', 0.1);
    data.append('biltot', 0);
    data.append('hco3_n', 22);
    data.append('o2s_n', [e.target.o2s_n][0].value);
    data.append('pco2_n', 33);
    data.append('ph_nu', 7.37);
    data.append('po2_n', [e.target.po2_n][0].value);
    data.append('tco2_n', 23);
    data.append('ptinr', 93);
    data.append('bjurin', 0);
    data.append('phurin', 0);
    data.append('choles', 0);
    data.append('gdpfull', 0);
    data.append('gdppfull', 0);
    data.append('hdlcho', 0);
    data.append('ldlcho', 0);
    data.append('trigl', 0);
    data.append('ua', 0);
    data.append('tshsnew', 0);
    data.append('albcp', 0);
    data.append('tp', 0);
    data.append('t4', 0);
    data.append('caltot', 0);
    data.append('mg', 0);
    data.append('glurapid', 0);
    data.append('hdld', 0);
    data.append('alp', 0);
    data.append('ggt', 0);
    data.append('glob', 0);
    data.append('ldh', [e.target.ldh][0].value);
    data.append('ft4', 0);
    data.append('lakt_dr', 0);
    data.append('acp001', 0);
    data.append('acp002', 0);
    data.append('acp009', 0);
    data.append('cglu', 0);
    data.append('cldh', 0);
    data.append('cprot', 0);
    data.append('sglu', 0);
    data.append('sldh', 0);
    data.append('sprot', 0);
    data.append('aca001', 0);
    data.append('aca002', 0);
    data.append('aca009', 0);
    data.append('cglua', 0);
    data.append('cldha', 0);
    data.append('cprota', 0);
    data.append('sglua', 0);
    data.append('sldha', 0);
    data.append('sprota', 0);
    data.append('tgl_lahir', [e.target.tgl_lahir][0].value);

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios
      .post(BLOODTEST_MEDICALRECORD, data, options)
      .then((e) => {
        history.push({
          pathname: '/patient-data/input/bloodtest',
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
          {t('ui.btn.back')}
        </Button>
      </ButtonToolbar>
      <ManualInputBloodTestForm handleSubmit={(e) => onSubmit(e)} />
    </Container>
  );
};

export default BloodTestFileUpload;
