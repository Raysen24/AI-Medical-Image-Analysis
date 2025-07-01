/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Button,
} from 'reactstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../../../../utils/Types';
import { PATIENT_MEDICALRECORD_BYID } from '../../../../../../../../utils/EndPoints';

const ManualInputBloodTestForm = ({ handleSubmit }) => {
  const params = useParams();
  const [idUser, setidUser] = useState(null);
  const [medicalPatient, setMedicalPatient] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    setidUser(userDetail);
    setLoading(true);

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    // last medical by patient
    axios.get(`${PATIENT_MEDICALRECORD_BYID}${params.id}`, options)
      .then((res) => {
        setMedicalPatient(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Col xs={12} md={12} lg={12} xl={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">Blood Test</h5>
            <h5 className="subhead">Input your blood test data</h5>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form__half">
              <input
                name="patient_id"
                component="input"
                type="hidden"
                value={params.id}
              />
              <input
                name="medical_id"
                component="input"
                type="hidden"
                value={medicalPatient.length !== 0 ? medicalPatient[0].id : null}
              />
              <input
                name="upload_by"
                component="input"
                type="hidden"
                value={loading && idUser.id}
              />
              <input
                name="hospital_id"
                component="input"
                type="hidden"
                value={loading && idUser.hospital_list[0].id}
              />
              <div className="form__form-group">
                <span className="form__form-group-label">BASOFIL</span>
                <div className="form__form-group-field">
                  <Field
                    name="basofil"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">CL</span>
                <div className="form__form-group-field">
                  <Field
                    name="cl"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">CREAT</span>
                <div className="form__form-group-field">
                  <Field
                    name="creat"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">EOS</span>
                <div className="form__form-group-field">
                  <Field
                    name="eos"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ERI</span>
                <div className="form__form-group-field">
                  <Field
                    name="eri"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">GSDFULL</span>
                <div className="form__form-group-field">
                  <Field
                    name="gsdfull"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">HB</span>
                <div className="form__form-group-field">
                  <Field
                    name="hb"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">HCT</span>
                <div className="form__form-group-field">
                  <Field
                    name="hct"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">K</span>
                <div className="form__form-group-field">
                  <Field
                    name="k"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">LEKO</span>
                <div className="form__form-group-field">
                  <Field
                    name="leko"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">LIMFOSIT</span>
                <div className="form__form-group-field">
                  <Field
                    name="limfosit"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">MCH</span>
                <div className="form__form-group-field">
                  <Field
                    name="mch"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">MCHC</span>
                <div className="form__form-group-field">
                  <Field
                    name="mchc"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">MCV</span>
                <div className="form__form-group-field">
                  <Field
                    name="mcv"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">MONOSIT</span>
                <div className="form__form-group-field">
                  <Field
                    name="monosit"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">NA</span>
                <div className="form__form-group-field">
                  <Field
                    name="na"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">NEUTB</span>
                <div className="form__form-group-field">
                  <Field
                    name="neutb"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">NLR1</span>
                <div className="form__form-group-field">
                  <Field
                    name="nlr1"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">PLT</span>
                <div className="form__form-group-field">
                  <Field
                    name="plt"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">RDW</span>
                <div className="form__form-group-field">
                  <Field
                    name="rdw"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">SEGMEN</span>
                <div className="form__form-group-field">
                  <Field
                    name="segmen"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">SGOT</span>
                <div className="form__form-group-field">
                  <Field
                    name="sgot"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">SGPT</span>
                <div className="form__form-group-field">
                  <Field
                    name="sgpt"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">UREUM</span>
                <div className="form__form-group-field">
                  <Field
                    name="ureum"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">LED</span>
                <div className="form__form-group-field">
                  <Field
                    name="led"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">BILDIREK</span>
                <div className="form__form-group-field">
                  <Field
                    name="bildirek"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">BILINDIR</span>
                <div className="form__form-group-field">
                  <Field
                    name="bilindir"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">BILTOT</span>
                <div className="form__form-group-field">
                  <Field
                    name="biltot"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">HCO3 N</span>
                <div className="form__form-group-field">
                  <Field
                    name="hco3_n"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">O2S N</span>
                <div className="form__form-group-field">
                  <Field
                    name="o2s_n"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">PCO2 N</span>
                <div className="form__form-group-field">
                  <Field
                    name="pco2_n"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">PH NU</span>
                <div className="form__form-group-field">
                  <Field
                    name="ph_nu"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">PO2 N</span>
                <div className="form__form-group-field">
                  <Field
                    name="po2_n"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">TCO2 N </span>
                <div className="form__form-group-field">
                  <Field
                    name="tco2_n"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">PTINR</span>
                <div className="form__form-group-field">
                  <Field
                    name="ptinr"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">BJURIN</span>
                <div className="form__form-group-field">
                  <Field
                    name="bjurin"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">PHURIN</span>
                <div className="form__form-group-field">
                  <Field
                    name="phurin"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">CHOLES</span>
                <div className="form__form-group-field">
                  <Field
                    name="choles"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form__half">
              <div className="form__form-group">
                <span className="form__form-group-label">GDPFULL</span>
                <div className="form__form-group-field">
                  <Field
                    name="gdpfull"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">GDPPFULL</span>
                <div className="form__form-group-field">
                  <Field
                    name="gdppfull"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">HDLCHO</span>
                <div className="form__form-group-field">
                  <Field
                    name="hdlcho"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">LDLCHO</span>
                <div className="form__form-group-field">
                  <Field
                    name="ldlcho"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">TRIGL</span>
                <div className="form__form-group-field">
                  <Field
                    name="trigl"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">UA</span>
                <div className="form__form-group-field">
                  <Field
                    name="ua"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">TSHSNEW</span>
                <div className="form__form-group-field">
                  <Field
                    name="tshsnew"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ALBCP</span>
                <div className="form__form-group-field">
                  <Field
                    name="albcp"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">TP</span>
                <div className="form__form-group-field">
                  <Field
                    name="tp"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">T4</span>
                <div className="form__form-group-field">
                  <Field
                    name="t4"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">CALTOT</span>
                <div className="form__form-group-field">
                  <Field
                    name="caltot"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">MG</span>
                <div className="form__form-group-field">
                  <Field
                    name="mg"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">GLURAPID</span>
                <div className="form__form-group-field">
                  <Field
                    name="glurapid"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">HDLD</span>
                <div className="form__form-group-field">
                  <Field
                    name="hdld"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ALP</span>
                <div className="form__form-group-field">
                  <Field
                    name="alp"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">GGT</span>
                <div className="form__form-group-field">
                  <Field
                    name="ggt"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">GLOB</span>
                <div className="form__form-group-field">
                  <Field
                    name="glob"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">LDH</span>
                <div className="form__form-group-field">
                  <Field
                    name="ldh"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">FT4</span>
                <div className="form__form-group-field">
                  <Field
                    name="ft4"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">LAKT DR</span>
                <div className="form__form-group-field">
                  <Field
                    name="lakt_dr"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ACPOO1</span>
                <div className="form__form-group-field">
                  <Field
                    name="acp001"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ACP002</span>
                <div className="form__form-group-field">
                  <Field
                    name="acp002"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ACP009</span>
                <div className="form__form-group-field">
                  <Field
                    name="acp009"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">CGLU</span>
                <div className="form__form-group-field">
                  <Field
                    name="cglu"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">CLDH</span>
                <div className="form__form-group-field">
                  <Field
                    name="cldh"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">CPROT</span>
                <div className="form__form-group-field">
                  <Field
                    name="cprot"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">SGLU</span>
                <div className="form__form-group-field">
                  <Field
                    name="sglu"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">SLDH</span>
                <div className="form__form-group-field">
                  <Field
                    name="sldh"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">SPROT</span>
                <div className="form__form-group-field">
                  <Field
                    name="sprot"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ACA001</span>
                <div className="form__form-group-field">
                  <Field
                    name="aca001"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ACA002</span>
                <div className="form__form-group-field">
                  <Field
                    name="aca002"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">ACA009</span>
                <div className="form__form-group-field">
                  <Field
                    name="aca009"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">CGLUA</span>
                <div className="form__form-group-field">
                  <Field
                    name="cglua"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">CLDHA</span>
                <div className="form__form-group-field">
                  <Field
                    name="cldha"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">CPROTA</span>
                <div className="form__form-group-field">
                  <Field
                    name="cprota"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">SGLUA</span>
                <div className="form__form-group-field">
                  <Field
                    name="sglua"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">SLDHA</span>
                <div className="form__form-group-field">
                  <Field
                    name="sldha"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">SPROTA</span>
                <div className="form__form-group-field">
                  <Field
                    name="sprota"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">TGL LAHIR</span>
                <div className="form__form-group-field">
                  <Field
                    name="tgl_lahir"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
            </div>
            <ButtonToolbar className="form__button-toolbar">
              <Button
                color="primary"
                type="submit"
                // disabled={!selectedStudent}
              >
                Submit
              </Button>
            </ButtonToolbar>
          </form>
        </CardBody>
      </Card>
    </Col>
  );
};

ManualInputBloodTestForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'blood_testmanual_form', // a unique identifier for this form
})(ManualInputBloodTestForm);
