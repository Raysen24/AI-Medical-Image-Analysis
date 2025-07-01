/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Button,
} from 'reactstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import renderDropZoneField from '../../../../../../shared/components/form/DropZone';
import { LOCALSTORAGE_USERDETAIL, LOCALSTORAGE_TOKEN } from '../../../../../../../utils/Types';
import { ACCOUNT_PATIENT } from '../../../../../../../utils/EndPoints';
import renderSelectField from '../../../../../../../shared/components/form/Select';
import renderFileInputField from '../../../../../../../shared/components/form/FileInput';

const CTScanFileUploadForm = ({ handleSubmit }) => {
  const params = useParams();
  const [idUser, setidUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [hospital, setHospital] = useState([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);

  const hospitalList = hospitalLoading && hospital
    ? hospitalLoading && hospital.map((e) => ({
      value: `${e.id}`, label: `${e.name}`,
    })) : [];
  const [patient, setPatient] = useState([]);

  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    setidUser(userDetail.id);
    setUserRole(userDetail.role);
    setHospital(userDetail.hospital_list);
    setHospitalLoading(true);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(`${ACCOUNT_PATIENT}${params.id}`, options)
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
            <h5 className="bold-text">CT-Scan File Upload Form</h5>
            <h5 className="subhead">For files upload</h5>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <input
              name="upload_by"
              component="input"
              type="hidden"
              value={idUser}
            />
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
                    <input
                      name="patient_id"
                      component="input"
                      type="hidden"
                      value={patient.id}
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
                )
            }
            <div className="form__form-group">
              <span className="form__form-group-label">Your CTScan Image</span>
              <div className="form__form-group-field">
                <Field
                  name="image"
                  component={renderFileInputField}
                  accept="image/x-png,image/jpeg"
                  required
                />
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

CTScanFileUploadForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'file_upload_default', // a unique identifier for this form
})(CTScanFileUploadForm);
