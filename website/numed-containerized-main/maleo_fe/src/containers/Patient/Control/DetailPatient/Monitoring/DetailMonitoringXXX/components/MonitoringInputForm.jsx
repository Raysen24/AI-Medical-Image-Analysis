/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Row,
} from 'reactstrap';
import axios from 'axios';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { PATIENT_MONITORING } from '../../../../../../../utils/EndPoints';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../../../utils/Types';
import renderSelectField from '../../../../../../../shared/components/form/Select';

const MonitoringInputForm = (stateOri) => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = useParams();
  const [isEditable, setEditable] = useState(false);
  const { updateData } = stateOri;
  const { location } = history;
  const { state } = location;
  const { data } = state;
  const { initialize } = stateOri;
  if (updateData) {
    initialize(updateData);
  }
  const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
  useEffect(() => {
    initialize(data);
  }, []);

  return (
    <Col xs={12} md={12} lg={12} xl={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">{t('patient.monitoring.detail')}</h5>
          </div>
          <form
            className="form form--horizontal"
            onSubmit={(e) => {
              e.preventDefault();
              const updatedData = new FormData();
              if (e.target.created_at_edit) {
                updatedData.append('created_at', [e.target.created_at_edit][0].value);
              }
              updatedData.append('oxygen_aid', [e.target.oxygen_aid_edit][0].value);
              updatedData.append('fall_score', [e.target.fall_score][0].value);
              updatedData.append('ews_score', [e.target.ews_score][0].value);
              if (userDetail.role === 'Nurse') {
                updatedData.append('nurse_notes', [e.target.nurse_notes][0].value);
                updatedData.append('update_date_nurse', moment(new Date()).format('YYYY-MM-DD'));
              }
              if (userDetail.role === 'Doctor') {
                if (e.target.decision_edit) {
                  updatedData.append('decision', [e.target.decision_edit][0].value);
                }
                updatedData.append('doctor_notes', [e.target.doctor_notes][0].value);
                updatedData.append('update_date_doctor', moment(new Date()).format('YYYY-MM-DD'));
              }
              const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
              const options = {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Token ${token}`,
                },
              };
              axios.patch(`${PATIENT_MONITORING}${params.id}/`, updatedData, options)
                .then(() => {
                  history.push({
                    // pathname: `/nurse/monitoring/list/${data.patient_id}`,
                    pathname: `/patient-data/list-monitoring/${data.patient_id}`,
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            {/*  Patient monitoring input menu (hospital/nurseview) */}
            <input
              name="patient_id"
              component="input"
              type="hidden"
              value={data.patient_id}
            />
            <input
              name="created_by"
              component="input"
              type="hidden"
              value={userDetail.id}
            />
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Date</span>
              <div className="form__form-group-field">
                <Field
                  name="created_at"
                  type="text"
                  component="input"
                  disabled
                />
              </div>
              {
                isEditable ? (
                  <div className="form__form-group-field">
                    <Field
                      name="created_at_edit"
                      type="datetime-local"
                      component="input"
                    />
                  </div>
                ) : ''
              }
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Oxygen Aid</span>
              <div className="form__form-group-field">
                <Field
                  name="oxygen_aid"
                  component="input"
                  type="text"
                  disabled
                />
              </div>
              {
                isEditable
                  ? (
                    <div className="form__form-group-field">
                      <Field
                        name="oxygen_aid_edit"
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
                        disabled={!isEditable}

                      />
                    </div>

                  ) : ''
              }
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Doctor Decision</span>
              <div className="form__form-group-field">
                <Field name="decision" component="input" type="text" disabled placeholder />
              </div>
            </div>
            {
                isEditable && userDetail.role === 'Doctor'
              && (
              <div className="form__form-group">
                <span className="form__form-group-label bold-text">Decisions</span>
                <div className="form__form-group-field">
                  <Field
                    name="decision_edit"
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
              )
              }
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Fall Score</span>
              <div className="form__form-group-field">
                <Field
                  name="fall_score"
                  component="input"
                  type="text"
                  placeholder="xxxx"
                  disabled={!isEditable}
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
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Doctor Notes</span>
              <span>{data.update_date_doctor}</span>
              <div className="form__form-group-field">
                {
                    (userDetail.role === 'Doctor' && isEditable)
                      ? <Field name="doctor_notes" component="textarea" type="text" placeholder="Doctor Notes" />
                      : <Field name="doctor_notes" component="textarea" type="text" disabled placeholder="Doctor Notes" />
                  }
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Nurses Notes</span>
              <span>{data.update_date_nurse}</span>
              <div className="form__form-group-field">
                {
                    (userDetail.role === 'Nurse' && isEditable)
                      ? <Field name="nurse_notes" component="textarea" type="text" placeholder="Nurses Notes" />
                      : <Field name="nurse_notes" component="textarea" disabled type="text" placeholder="Nurses Notes" />
                  }
              </div>
            </div>
            <ButtonToolbar className="form__button-toolbar">
              <Row className="mt-4">
                <Col md={12}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditable(!isEditable)}
                  > {!isEditable ? 'Edit' : 'Cancel'}
                  </button>
                  {isEditable && (
                  <button
                    type="submit"
                    className="btn btn-primary"
                  > Update
                  </button>
                  )}
                  {/* {isEditable === false && (
                  <button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
                      const options = {
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Token ${token}`,
                        },
                      };
                      axios.delete(`${PATIENT_MONITORING}/${params.id}/`, options)
                        .then(() => {
                          history.push({
                            pathname: '/nurse/index',
                          });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                    className="btn btn-danger"
                  > Delete
                  </button>
                  )} */}
                </Col>
              </Row>
            </ButtonToolbar>
          </form>
        </CardBody>
      </Card>
    </Col>

  );
};

export default reduxForm({
  form: 'monitoring_information_form', // a unique identifier for this form
})(MonitoringInputForm);
