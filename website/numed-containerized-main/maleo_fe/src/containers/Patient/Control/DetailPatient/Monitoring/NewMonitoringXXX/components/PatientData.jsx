/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Button,
} from 'reactstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../../../utils/Types';
import { ACCOUNT_PATIENT } from '../../../../../../../utils/EndPoints';
import renderSelectField from '../../../../../../../shared/components/form/Select';

const PatientDataDetails = ({ handleSubmit }) => {
  const { t } = useTranslation('common');
  const params = useParams();
  const [patient, setPatient] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(`${ACCOUNT_PATIENT}${params.id}/`, options)
      .then((res) => {
        setPatient(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // console.log('ari nih', patient.id);
  const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));

  return (
    <Col xs={12} md={12} lg={12} xl={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">{t('patient.monitoring.new')}</h5>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <input
              name="created_by"
              component="input"
              type="hidden"
              value={userDetail.id}
            />
            <input
              name="patient_id"
              component="input"
              type="hidden"
              placeholder={patient.fullname}
              value={loading ? patient.id : ''}
            />
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Date</span>
              <div className="form__form-group-field">
                <Field
                  name="created_at"
                  component="input"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">Patient Name</span>
              <div className="form__form-group-field">
                <Field
                  name="patientid"
                  component="input"
                  disabled
                  placeholder={patient.fullname}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Oxygen Aid</span>
              <div className="form__form-group-field">
                <Field
                  name="oxygen_aid"
                  component={renderSelectField}
                  options={[
                    { value: 'None', label: 'None' },
                    { value: 'Nasal Cannula', label: 'Nasal Cannula' },
                    { value: 'Simple Mask', label: 'Simple Mask' },
                    { value: 'Partial Rebreathing Mask (RM)', label: 'Partial Rebreathing Mask (RM)' },
                    { value: 'NonRebreathing Mask (NRM)', label: 'NonRebreathing Mask (NRM)' },
                    { value: 'High Flow Nasal Cannula (HNFC)', label: 'High Flow Nasal Cannula (HNFC)' },
                    { value: 'Non-invasive Ventilation (NIV)', label: 'Non-invasive Ventilation (NIV)' },
                    { value: 'Ventilator', label: 'Ventilator' },
                  ]}
                  placeholder="Oxygen Aid"
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Fall Score</span>
              <div className="form__form-group-field">
                <Field
                  name="fall_score"
                  component="input"
                  type="text"
                  placeholder="xxxx"
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">EWS Score </span>
              <div className="form__form-group-field">
                <Field
                  name="ews_score"
                  component="input"
                  type="text"
                  placeholder="xxxx"
                />
              </div>
            </div>
            {
              userDetail.role === 'Doctor'
            && (
              <>
                <div className="form__form-group">
                  <span className="form__form-group-label bold-text">Decisions</span>
                  <div className="form__form-group-field">
                    <Field
                      name="decision"
                      component={renderSelectField}
                      options={[
                        { value: 'No Decision', label: 'No Decision' },
                        { value: 'Send patient to hospital for observation', label: 'Send patient to hospital for observation' },
                        { value: 'Outpatient with intensive monitoring', label: 'Outpatient with intensive monitoring' },
                        { value: 'Inpatient', label: 'Inpatient' },
                        { value: 'Inpatient with intensive care', label: 'Inpatient with intensive care' },
                        { value: 'Continue to non-covid treatment', label: 'Continue to non-covid treatment' },
                      ]}
                      placeholder="Select One"
                      required
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <div className="card__title">
                    <h5 className="bold-text">Doctor Notes</h5>
                    {/* <h5 className="subhead"> dd/mm/yyyy</h5> */}
                  </div>
                  <div className="form__form-group-field">
                    <Field
                      name="doctor_notes"
                      component="textarea"
                      type="text"
                      placeholder="Add your notes here.."
                    />
                  </div>
                </div>
              </>
            )
            }
            {
              userDetail.role === 'Nurse'
            && (
            <div className="form__form-group">
              <div className="card__title">
                <h5 className="bold-text">Nurses Notes</h5>
                {/* <h5 className="subhead"> dd/mm/yyyy</h5> */}
              </div>
              <div className="form__form-group-field">
                <Field
                  name="nurse_notes"
                  component="textarea"
                  type="text"
                  placeholder="Add your notes here.."
                />
              </div>
            </div>
            )
            }
            <ButtonToolbar className="form__button-toolbar">
              <Button
                color="primary"
                type="submit"
                // disabled={!(selectedTanggal && selectedTipe && selectedPhoto)}
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
PatientDataDetails.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'account_information_form', // a unique identifier for this form
})(PatientDataDetails);
