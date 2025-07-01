/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Button,
} from 'reactstrap';
import axios from 'axios';
import { LOCALSTORAGE_USERDETAIL, LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import { ACCOUNT_PATIENT } from '../../../../../../utils/EndPoints';
import renderSelectField from '../../../../../../shared/components/form/Select';

const ManualInnputVSRTestForm = ({ handleSubmit }) => {
  const [idUser, setidUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [hospital, setHospital] = useState([]);
  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    // console.log('user nih', userDetail);
    setidUser(userDetail.id);
    setUserRole(userDetail.role);
    setHospital(userDetail.hospital_list);
  }, []);
  const [patient, setPatient] = useState([]);
  // const [selectedStudent, setSelectedStudent] = useState(false);

  const patientList = patient
    ? patient.map((e) => ({
      value: `${e.id}`, label: `${e.fullname}`,
    })) : [];
  const hospitalList = hospital
    ? hospital.map((e) => ({
      value: `${e.id}`, label: `${e.name}`,
    })) : [];
  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(ACCOUNT_PATIENT, options)
      .then((res) => {
        setPatient(res.data);
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
            <h5 className="bold-text">Vital Sign</h5>
            <h5 className="subhead">Input your Vital Sign data</h5>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form__half">
              {
              userRole === 'Patient'
                ? (
                  <input
                    name="patient_id"
                    component="input"
                    type="hidden"
                    value={idUser}
                  />
                ) : (
                  <>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Patient Name</span>
                      <div className="form__form-group-field">
                        <Field
                          name="patient_id"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={patientList || [
                            { value: 'one', label: 'Not Found' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                  </>
                )
            }
              <input
                name="upload_by"
                component="input"
                type="hidden"
                value={idUser}
              />
              <div className="form__form-group">
                <span className="form__form-group-label">Hospital</span>
                <div className="form__form-group-field">
                  <Field
                    name="hospital_id"
                    component={renderSelectField}
                    type="text"
                    placeholder="Please select an option"
                    options={hospitalList || [
                      { value: 'one', label: 'Not Found' },
                    ]}
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">Blood Pressure (mm/Hg)</span>
                <div className="form__form-group-field">
                  <Field
                    name="blood_pressure"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">Respiratary Rate (Breaths per minute)</span>
                <div className="form__form-group-field">
                  <Field
                    name="respirotary_rate"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">Saturation 02 (%)</span>
                <div className="form__form-group-field">
                  <Field
                    name="saturate"
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
                <span className="form__form-group-label">Temperature (°C)</span>
                <div className="form__form-group-field">
                  <Field
                    name="temperature"
                    component="input"
                    type="number"
                    placeholder="xx.xx"
                    required
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">Heart Rate (beats per minute)</span>
                <div className="form__form-group-field">
                  <Field
                    name="heart_rate"
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

ManualInnputVSRTestForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'vsr_testmanual_form', // a unique identifier for this form
})(ManualInnputVSRTestForm);
