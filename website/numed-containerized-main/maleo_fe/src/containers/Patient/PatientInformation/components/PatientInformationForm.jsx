/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import {
  Col, Card, CardBody,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import renderSelectField from '../../../../shared/components/form/Select';
// import renderDropZoneMultipleField from '../../../../shared/components/form/DropZoneMultiple';
import { LOCALSTORAGE_TOKEN } from '../../../../utils/Types';
import {
  CXR_MEDICALRECORD, CTSCAN_MEDICALRECORD, BLOODTEST_MEDICALRECORD, PATIENT_MEDICALRECORD_BYID, PCRANTIGENTSWAB_MEDICALRECORD,
} from '../../../../utils/EndPoints';

const PatientInformationForm = () => {
  const params = useParams();
  const [patientInfo, setpatientInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastMedicalRecord, setLastMedicalRecord] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(`${PATIENT_MEDICALRECORD_BYID}${params.id}/`, options)
      .then((res) => {
        setpatientInfo(res.data);
        if (res.data.length > 0) {
          setLastMedicalRecord(true);
        }
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [cxrLastUpdate, setcxrLastUpdate] = useState([]);
  const [ctscanLastUpdate, setctscanLastUpdate] = useState([]);
  const [bloodtestLastUpdate, setbloodtestLastUpdate] = useState([]);
  const [pcrLastUpdate, setPcrLastUpdate] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(CXR_MEDICALRECORD, options)
      .then((res) => {
        setcxrLastUpdate(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(CTSCAN_MEDICALRECORD, options)
      .then((res) => {
        setctscanLastUpdate(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(BLOODTEST_MEDICALRECORD, options)
      .then((res) => {
        setbloodtestLastUpdate(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(PCRANTIGENTSWAB_MEDICALRECORD, options)
      .then((res) => {
        setPcrLastUpdate(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Col md={12} lg={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <form className="form product-edit">
            <div className="form__half">
              <div className="form__form-group-id-category">
                <div className="form__form-group form__form-group-id">
                  <span className="form__form-group-label bold-text">MR ID</span>
                  <div className="form__form-group-field">
                    <Field
                      name="mr_id_patient"
                      component="input"
                      type="text"
                      disabled
                      placeholder={lastMedicalRecord && patientInfo[0].mr_id_patient}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label bold-text">Your Name</span>
                  <div className="form__form-group-field">
                    <Field
                      name="fullname"
                      component="input"
                      type="text"
                      placeholder={lastMedicalRecord && patientInfo[0].patient_detail.fullname}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="form__form-group-id-category">
                <div className="form__form-group">
                  <span className="form__form-group-label">Assigned Doctor</span>
                  <div className="form__form-group-field">
                    <Field
                      name="name"
                      component="input"
                      type="text"
                      placeholder={lastMedicalRecord && patientInfo[0].doctor_detail.fullname}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="form__form-group-id-category">
                <div className="form__form-group form__form-group-id">
                  <span className="form__form-group-label">Date of Birth</span>
                  <div className="form__form-group-field">
                    <Field
                      name="dob"
                      component="input"
                      // type="date"
                      placeholder={lastMedicalRecord && patientInfo[0].patient_detail.dob}
                      disabled
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Sex</span>
                  <div className="form__form-group-field">
                    <Field
                      name="sex"
                      component="input"
                      type="text"
                      placeholder={lastMedicalRecord && patientInfo[0].patient_detail.sex}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="form__form-group-id-category">
                <div className="form__form-group form__form-group-id">
                  <span className="form__form-group-label">Phone Number</span>
                  <div className="form__form-group-field">
                    <Field
                      name="phone"
                      component="input"
                      type="phone"
                      placeholder={lastMedicalRecord && patientInfo[0].patient_detail.phone}
                      disabled
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Email</span>
                  <div className="form__form-group-field">
                    <Field
                      name="email"
                      component="input"
                      type="text"
                      placeholder={lastMedicalRecord && patientInfo[0].patient_detail.email}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">Address</span>
                <div className="form__form-group-field">
                  <Field
                    name="address"
                    component="textarea"
                    type="text"
                    placeholder={lastMedicalRecord && patientInfo[0].patient_detail.address}
                    disabled
                  />
                </div>
              </div>
            </div>
            {/* <div className="form__half">
              <div className="form form--vertical">
                <div className="card__title">
                  <h5 className="bold-text">AI Based Patient Status</h5>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Blood Status</span>
                  <div className="form__form-group-field">
                    <Field
                      name="brand"
                      component="input"
                      type="text"
                      disabled
                      placeholder={loading && bloodtestLastUpdate.length > 0 ? `Probapredict ${bloodtestLastUpdate[0].probapredict} || Classpredict ${bloodtestLastUpdate[0].classpredict}` : ''}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">CT-Scan Status</span>
                  <div className="form__form-group-field">
                    <Field
                      name="general_category"
                      component="input"
                      type="text"
                      disabled
                      placeholder={loading && ctscanLastUpdate.length > 0 ? `Diagnosis ${ctscanLastUpdate[0].diagnosis} || Cofidence ${ctscanLastUpdate[0].confidence}` : ''}
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">CXR Status</span>
                  <div className="form__form-group-field">
                    <Field
                      name="delivery"
                      component="input"
                      type="text"
                      disabled
                      placeholder={loading && cxrLastUpdate.length > 0 ? `Pneumonia ${cxrLastUpdate[0].pneumonia} || Covid19 ${cxrLastUpdate[0].covid} || Normal ${cxrLastUpdate[0].normal}` : ''}
                    />
                  </div>
                </div>
                {
                  loading && pcrLastUpdate.length > 0 && pcrLastUpdate[0].category === 'PCR'
                    ? (
                      <div className="form__form-group">
                        <span className="form__form-group-label">PCR Status</span>
                        <div className="form__form-group-field">
                          <Field
                            name="weight"
                            component="input"
                            type="text"
                            disabled
                            placeholder={loading && pcrLastUpdate.length > 0 ? `${pcrLastUpdate[0].result_1_pcr} || ${pcrLastUpdate[0].result_2_pcr} || ${pcrLastUpdate[0].result_3_pcr} ` : ''}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="form__form-group">
                        <span className="form__form-group-label">Antigen Swab Status</span>
                        <div className="form__form-group-field">
                          <Field
                            name="size"
                            component="input"
                            type="text"
                            disabled
                            placeholder={loading && pcrLastUpdate.length > 0 ? pcrLastUpdate[0].result_swab : ''}
                          />
                        </div>
                      </div>
                    )
                }
              </div>
            </div> */}
          </form>
        </CardBody>
      </Card>
    </Col>
  );
};

export default reduxForm({
  form: 'product_edit_form', // a unique identifier for this form
})(PatientInformationForm);
