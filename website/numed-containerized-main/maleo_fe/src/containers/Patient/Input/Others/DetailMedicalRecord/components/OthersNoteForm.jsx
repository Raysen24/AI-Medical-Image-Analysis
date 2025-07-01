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
// import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { OTHERS_MEDICALRECORD } from '../../../../../../utils/EndPoints';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';

const MonitoringInputForm = (stateOri) => {
  // const { t } = useTranslation('common');
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
  useEffect(() => {
    initialize(data);
  }, []);

  return (
    <Col xs={12} md={12} lg={12} xl={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">Other Notes Medical Record</h5>
          </div>
          <form
            className="form form--horizontal"
            onSubmit={(e) => {
              e.preventDefault();
              const updatedData = new FormData();
              const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
              const options = {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Token ${token}`,
                },
              };
              updatedData.append('note', e.target.note.value);
              axios.patch(`${OTHERS_MEDICALRECORD}${params.id}/`, updatedData, options)
                .then(() => {
                  history.push({
                    // pathname: `/nurse/monitoring/list/${data.patient_id}`,
                    pathname: '/patient-data/listing/others',
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Note</span>
              <span>{data.update_date_nurse}</span>
              <div className="form__form-group-field">
                <Field
                  name="note"
                  component="textarea"
                  type="text"
                  placeholder="Ct value"
                  disabled={!isEditable}
                  required
                />
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
