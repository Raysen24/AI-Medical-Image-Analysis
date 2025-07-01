/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Button,
} from 'reactstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../../utils/Types';
import { ACCOUNT_PATIENT } from '../../../../../../utils/EndPoints';
import renderSelectField from '../../../../../../shared/components/form/Select';
import renderFileInputField from '../../../../../../shared/components/form/FileInput';

const FileUploadCXRForm = ({ handleSubmit }) => {
  const { t } = useTranslation('common');
  const [idUser, setidUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [hospital, setHospital] = useState([]);

  const [patient, setPatient] = useState([]);
  const patientList = patient
    ? patient.map((e) => ({
      value: `${e.id}`, label: `${e.fullname}`,
    })) : [];
  const hospitalList = hospital
    ? hospital.map((e) => ({
      value: `${e.id}`, label: `${e.name}`,
    })) : [];

  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    setidUser(userDetail.id);
    setUserRole(userDetail.role);
    setHospital(userDetail.hospital_list);

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
    <Col md={12} lg={12}>
      <Card className="card--not-full-height">
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">{t('patient.input.cxr.cxr_upload')}</h5>
            <h5 className="subhead">For files upload</h5>
          </div>
          <form className="form form--horizontal" onSubmit={handleSubmit}>
            <input
              name="upload_by"
              component="input"
              type="hidden"
              value={idUser}
            />
            {
              userRole === 'Patient'
                ? (
                  <>
                    <input
                      name="patient_id"
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
                  </>
                ) : (
                  <>
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

            <div className="form__form-group">
              <span className="form__form-group-label">Your CXR Image</span>
              <div className="form__form-group-field">
                <Field
                  name="image"
                  component={renderFileInputField}
                  accept="image/"
                  required
                />
              </div>
            </div>
            <ButtonToolbar className="form__button-toolbar">
              <Button color="primary" type="submit">
                Submit
              </Button>
            </ButtonToolbar>
          </form>
        </CardBody>
      </Card>
    </Col>
  );
};

FileUploadCXRForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'file_upload_default', // a unique identifier for this form
})(FileUploadCXRForm);
