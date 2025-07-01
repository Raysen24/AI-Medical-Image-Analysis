/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {
  Col, Card, CardBody,
} from 'reactstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import { BLOODTEST_MEDICALRECORD } from '../../../../../../utils/EndPoints';

const ResultBloodTest = ({ handleSubmit }) => {
  const params = useParams();
  const [bloodtestRecord, setbloodtestRecord] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(`${BLOODTEST_MEDICALRECORD}${params.id}/`, options)
      .then((res) => {
        setbloodtestRecord(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Col xs={12} md={12} lg={12} xl={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <form className="form" onSubmit={handleSubmit}>
            <div className="form__half">
              <div>Hematology</div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Hemoglobin) HB</span>
                <div className="form__form-group-field">
                  <Field
                    name="hb"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.hb}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Hematocrit) HCT</span>
                <div className="form__form-group-field">
                  <Field
                    name="hct"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.hct}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Leukocytes) LEKO</span>
                <div className="form__form-group-field">
                  <Field
                    name="leko"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.leko}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Platelets) PLT</span>
                <div className="form__form-group-field">
                  <Field
                    name="plt"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.plt}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">Erythrocytes (ERI)</span>
                <div className="form__form-group-field">
                  <Field
                    name="eri"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.eri}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Red Cell Distributions Width) RDW</span>
                <div className="form__form-group-field">
                  <Field
                    name="rdw"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.rdw}
                    disabled
                  />
                </div>
              </div>
              <div>Avarage Erythrocytes Value</div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Mean Cospuscular Valome) MCV</span>
                <div className="form__form-group-field">
                  <Field
                    name="mcv"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.mcv}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Mean Cospuscular Hemoglobin) MCH</span>
                <div className="form__form-group-field">
                  <Field
                    name="mch"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.mch}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Mean Cospuscular Hemoglobin Concentration) MCHC</span>
                <div className="form__form-group-field">
                  <Field
                    name="mchc"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.mchc}
                    disabled
                  />
                </div>
              </div>
              <div>Count Type</div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Basophil) BASOFIL</span>
                <div className="form__form-group-field">
                  <Field
                    name="basofil"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.basofil}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Eosinophils) EOS</span>
                <div className="form__form-group-field">
                  <Field
                    name="eos"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.eos}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Stem Neutrophils) NEUTB</span>
                <div className="form__form-group-field">
                  <Field
                    name="neutb"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.neutb}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Segmented Neutophils) SEGMEN</span>
                <div className="form__form-group-field">
                  <Field
                    name="segmen"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.segmen}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="form__half">
              <div className="form__form-group">
                <span className="form__form-group-label">(Lymphocytes) LIMFOSIT</span>
                <div className="form__form-group-field">
                  <Field
                    name="limfosit"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.limfosit}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">Monocytes (MONOSIT)</span>
                <div className="form__form-group-field">
                  <Field
                    name="monosit"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.monosit}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Neutrophil Lymphocytes Ratio) NLR1</span>
                <div className="form__form-group-field">
                  <Field
                    name="nlr1"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.nlr1}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Erythrocytes Sedimentation Rate) LED</span>
                <div className="form__form-group-field">
                  <Field
                    name="led"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.led}
                    disabled
                  />
                </div>
              </div>
              <div>Blood Chemestry</div>
              <div>Arterial Blood Gas Analysis</div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Partial Pressure of Oxygen) PO2 N</span>
                <div className="form__form-group-field">
                  <Field
                    name="po2_n"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.po2_n}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Oxygen Saturation) O2S N</span>
                <div className="form__form-group-field">
                  <Field
                    name="o2s_n"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.o2s_n}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Serum Glutamic Oxaloacetic Transaminase) SGOT</span>
                <div className="form__form-group-field">
                  <Field
                    name="sgot"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.sgot}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Serum Glutamic Pyruvic Transaminase) SGPT</span>
                <div className="form__form-group-field">
                  <Field
                    name="sgpt"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.sgpt}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Random Plasma Glucose Test) GDSFULL</span>
                <div className="form__form-group-field">
                  <Field
                    name="gsdfull"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.gsdfull}
                    disabled
                  />
                </div>
              </div>
              <div>Kidney Function</div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Urea) UREUM</span>
                <div className="form__form-group-field">
                  <Field
                    name="ureum"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.ureum}
                    disabled
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Creatinine) CREAT</span>
                <div className="form__form-group-field">
                  <Field
                    name="creat"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.creat}
                    disabled
                  />
                </div>
              </div>
              <div>Cardiac Enzymes</div>
              <div className="form__form-group">
                <span className="form__form-group-label">(Lactate Dehydrogenase) LDH</span>
                <div className="form__form-group-field">
                  <Field
                    name="ldh"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.ldh}
                    disabled
                  />
                </div>
              </div>
              {/* <div className="form__form-group">
                <span className="form__form-group-label">BILDIREK</span>
                <div className="form__form-group-field">
                  <Field
                    name="bildirek"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.bildirek}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">BILINDIR</span>
                <div className="form__form-group-field">
                  <Field
                    name="bilindir"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.bilindir}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">BILTOT</span>
                <div className="form__form-group-field">
                  <Field
                    name="biltot"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.biltot}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">HCO3 N</span>
                <div className="form__form-group-field">
                  <Field
                    name="hco3_n"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.hco3_n}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">Oxygen Saturation (O2S_N)</span>
                <div className="form__form-group-field">
                  <Field
                    name="o2s_n"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.o2s_n}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">PCO2 N</span>
                <div className="form__form-group-field">
                  <Field
                    name="pco2_n"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.pco2_n}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">PH NU</span>
                <div className="form__form-group-field">
                  <Field
                    name="ph_nu"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.ph_nu}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">PO2 N</span>
                <div className="form__form-group-field">
                  <Field
                    name="po2_n"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.po2_n}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">TCO2 N </span>
                <div className="form__form-group-field">
                  <Field
                    name="tco2_n"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.tco2_n}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">PTINR</span>
                <div className="form__form-group-field">
                  <Field
                    name="ptinr"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.ptinr}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">BJURIN</span>
                <div className="form__form-group-field">
                  <Field
                    name="bjurin"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.bjurin}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">PHURIN</span>
                <div className="form__form-group-field">
                  <Field
                    name="phurin"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.phurin}
                    disabled
                  />
                </div>
              </div> */}
              {/* <div className="form__form-group">
                <span className="form__form-group-label">CHOLES</span>
                <div className="form__form-group-field">
                  <Field
                    name="choles"
                    component="input"
                    type="number"
                    placeholder={bloodtestRecord.choles}
                    disabled
                  />
                </div>
              </div> */}
            </div>
          </form>
        </CardBody>
      </Card>
    </Col>
  );
};

ResultBloodTest.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'account_information_form', // a unique identifier for this form
})(ResultBloodTest);
