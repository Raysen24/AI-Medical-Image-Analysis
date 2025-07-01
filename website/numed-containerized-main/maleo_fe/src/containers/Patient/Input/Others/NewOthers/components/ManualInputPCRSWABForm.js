/* eslint-disable max-len */
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

const ManualInputBloodTestForm = ({ handleSubmit }) => {
  const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));

  const [patient, setPatient] = useState([]);
  // const [selectedStudent, setSelectedStudent] = useState(false);

  const patientList = patient
    ? patient.map((e) => ({
      value: `${e.id}`, label: `${e.fullname}`,
    })) : [];
  const hospitalList = userDetail.hospital_list
    ? userDetail.hospital_list.map((e) => ({
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
            <h5 className="bold-text">Other Notes</h5>
            <h5 className="subhead">Input your notes</h5>
          </div>
          <form className="form form--horizontal" onSubmit={handleSubmit}>
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
            {
              userDetail.role !== 'Patient'
                && (
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
            <div className="form__form-group">
              <span className="form__form-group-label">Notes</span>
              <div className="form__form-group-field">
                <Field
                  name="note"
                  component="textarea"
                  type="text"
                  placeholder="Note"
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

ManualInputBloodTestForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'blood_testmanual_form', // a unique identifier for this form
})(ManualInputBloodTestForm);
