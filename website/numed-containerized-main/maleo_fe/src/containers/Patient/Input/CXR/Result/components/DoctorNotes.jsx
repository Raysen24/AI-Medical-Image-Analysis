/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Row, Alert,
} from 'reactstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../../utils/Types';
import { CXR_MEDICALRECORD } from '../../../../../../utils/EndPoints';

const PatientDataDetails = (stateOri) => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = useParams();
  const [isEditable, setEditable] = useState(false);
  const { updateResponse, updateData } = stateOri;
  const { location } = history;
  const { state } = location;
  const { data } = state;
  const { initialize } = stateOri;
  if (updateData) {
    initialize(updateData);
  }
  const [roleUser, setRoleUser] = useState(null);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    initialize(data);
    const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    setRoleUser(userDetail.role);
    setUserId(userDetail.id);
  }, []);
  return (
    <Col xs={12} md={12} lg={12} xl={12}>
      <Card>
        <CardBody>
          <div className="card__title">
            <h5 className="bold-text">{t('patient.input.cxr.notes')}</h5>
            <h5 className="subhead"> {data.update_date_doctor} </h5>
          </div>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              const updatedData = new FormData();
              updatedData.append('doctor_id', userId);
              updatedData.append('doctor_note', [e.target.doctor_note][0].value);

              const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
              const options = {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Token ${token}`,
                },
              };
              axios.patch(`${CXR_MEDICALRECORD}${params.id}/`, updatedData, options)
                .then(() => {
                  history.push('/patient-data/input/cxr');
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <div className="form__form-group">
              <div className="form__form-group-field">
                <Field
                  name="doctor_note"
                  component="textarea"
                  type="text"
                  disabled={!isEditable}
                  placeholder="There is no notes here.."
                />
              </div>
            </div> {
              roleUser === 'Doctor'
            && (
            <ButtonToolbar className="form__button-toolbar">
              <Row className="mt-4">
                <Col md={12}>
                  <button
                    type="button"
                    className="btn btn-warning"
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
                </Col>
              </Row>
            </ButtonToolbar>
            )
            }
          </form>
          {updateResponse ? (
            <Row>
              <Col md={12}>
                <Alert className="container mb-4 p-1" color="info">
                  <p>Update Data berhasil
                  </p>
                </Alert>
              </Col>
            </Row>
          ) : null }
        </CardBody>
      </Card>
    </Col>
  );
};

export default reduxForm({
  form: 'update_patient_form', // a unique identifier for this form
})(PatientDataDetails);
