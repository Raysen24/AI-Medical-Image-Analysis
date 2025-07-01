/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Row,
} from 'reactstrap';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../../utils/Types';
import {
  MEDICALRECORD, BUILDING_BY_IDHOSPITAL, ROOM_BY_IDBUILDING, BED_BY_IDROOM,
} from '../../../../../../utils/EndPoints';
import renderSelectField from '../../../../../../shared/components/form/Select';
import Soap from '../../Soap';

const PatientDataDetails = (stateOri) => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = useParams();
  const [isEditable, setEditable] = useState(false);
  const { location } = history;
  const { state } = location;
  const { data } = state;
  const { initialize } = stateOri;
  const [statusPatient, setStatusPatient] = useState('');
  // console.log('hahaha', data);

  // get user detail
  const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));

  //  get token user
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };
  const [hospitals, setHospitals] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  useEffect(() => {
    initialize(data);

    if (userDetail.hospital_list.length !== 0) {
      setHospitals(userDetail.hospital_list.map((e) => ({ value: `${e.id}`, label: `${e.name}` })));
    }
  }, []);

  return (
    <Col xs={12} md={12} lg={12} xl={12}>
      <Card>
        <CardBody>
          <div className="card__title">
            <h5 className="bold-text">{t('patient.medical_record.detail')}</h5>
          </div>
          <form
            className="form form--horizontal"
            onSubmit={(e) => {
              e.preventDefault();
              console.log('masukkkkk', e);
              const updatedData = new FormData();
              if (e.target.patient_status_edit.value !== '') {
                updatedData.append('patient_status', [e.target.patient_status_edit][0].value);
              }
              if (e.target.hospital_id_edit) {
                updatedData.append('hospital_id', [e.target.hospital_id_edit][0].value);
              }
              if (e.target.building_id_edit) {
                updatedData.append('building_id', [e.target.building_id_edit][0].value);
              }
              if (e.target.room_id_edit) {
                updatedData.append('room_id', [e.target.room_id_edit][0].value);
              }
              if (e.target.bed_id_edit) {
                updatedData.append('bed_id', [e.target.bed_id_edit][0].value);
              }

              if (userDetail.role === 'Hospital Admin') {
                updatedData.append('admission_date', [e.target.admission_date][0].value);
                updatedData.append('death_date', [e.target.death_date][0].value);
                updatedData.append('discharged_date', [e.target.discharged_date][0].value);
              }
              axios
                .patch(`${MEDICALRECORD}${params.id}/`, updatedData, options)
                .then(() => {
                  history.goBack();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            <div className="form__half">
              <div className="form__form-group">
                <span className="form__form-group-label">Patient Name</span>
                <div className="form__form-group-field">
                  <Field placeholder={data.patient_detail.fullname} name="" component="input" type="text" disabled />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">MR ID</span>
                <div className="form__form-group-field">
                  <Field name="mr_id" component="input" type="number" min="0" disabled placeholder={data.patient_detail.mr_id_patient} />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label">Status</span>
                <div className="form__form-group-field">
                  <Field name="patient_status" component="input" type="text" disabled placeholder />
                </div>
              </div>
              {
                isEditable
              && (
              <div className="form__form-group">
                <span className="form__form-group-label bold-text">Status</span>
                <div className="form__form-group-field">
                  <Field
                    name="patient_status_edit"
                    component={renderSelectField}
                    options={[
                      { value: 'Inpatient', label: 'Inpatient' },
                      { value: 'Outpatient', label: 'Outpatient' },
                    ]}
                    onChange={(e) => setStatusPatient(e.value)}
                    placeholder="Select One"
                    required
                  />
                </div>
              </div>
              )
              }
              {statusPatient === 'Inpatient' && (
              <>
                <div className="form__form-group">
                  <span className="form__form-group-label bold-text">Hospital</span>
                  <div className="form__form-group-field">
                    <Field
                      name="hospital_id_edit"
                      component={renderSelectField}
                      options={hospitals || [
                        { value: 'one', label: 'Select One' },
                      ]}
                      placeholder="Select One"
                      onChange={(event) => {
                        axios.get(`${BUILDING_BY_IDHOSPITAL + event.value}`, options)
                          .then((res) => {
                            setBuildings(res.data.map((e) => ({ value: `${e.id}`, label: `${e.name}` })));
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label bold-text">Building</span>
                  <div className="form__form-group-field">
                    <Field
                      name="building_id_edit"
                      component={renderSelectField}
                      options={buildings || [
                        { value: 'one', label: 'Room 1' },
                      ]}
                      placeholder="Select One"
                      onChange={(event) => {
                        axios.get(`${ROOM_BY_IDBUILDING + event.value}`, options)
                          .then((res) => {
                            setRooms(res.data.map((e) => ({ value: `${e.id}`, label: `${e.room_name}` })));
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label bold-text">Room</span>
                  <div className="form__form-group-field">
                    <Field
                      name="room_id_edit"
                      component={renderSelectField}
                      options={rooms || [
                        { value: 'one', label: 'Select One' },
                      ]}
                      placeholder="Select One"
                      onChange={(event) => {
                        axios.get(`${BED_BY_IDROOM + event.value}`, options)
                          .then((res) => {
                            setBeds(res.data.map((e) => ({ value: `${e.id}`, label: `${e.bed_number}` })));
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                      required
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label bold-text">Bed Number</span>
                  <div className="form__form-group-field">
                    <Field
                      name="bed_id_edit"
                      component={renderSelectField}
                      options={beds || [
                        { value: 'one', label: 'Select One' },
                      ]}
                      placeholder="Select One"
                      required
                    />
                  </div>
                </div>
              </>
              )}
              {
                data.patient_status === 'Inpatient'
                && (
                <>
                  <div className="form__form-group">
                    <span className="form__form-group-label">Hospital</span>
                    <div className="form__form-group-field">
                      <Field component="input" type="text" disabled placeholder={data.hospital_detail && data.hospital_detail.name} />
                    </div>
                  </div>
                  <div className="form__form-group">
                    <span className="form__form-group-label">Building</span>
                    <div className="form__form-group-field">
                      <Field component="input" type="text" disabled placeholder={data.building_detail && data.building_detail.name} />
                    </div>
                  </div>
                  <div className="form__form-group">
                    <span className="form__form-group-label">Room</span>
                    <div className="form__form-group-field">
                      <Field component="input" type="text" disabled placeholder={data.room_detail && data.room_detail.room_name} />
                    </div>
                  </div>
                  <div className="form__form-group">
                    <span className="form__form-group-label">Bed</span>
                    <div className="form__form-group-field">
                      <Field component="input" type="text" disabled placeholder={data.bed_detail && data.bed_detail.bed_number} />
                    </div>
                  </div>
                </>
                )
              }

            </div>
            <div className="form__half">

              <div className="form__form-group">
                <span className="form__form-group-label bold-text">Admission Date</span>
                <div className="form__form-group-field">
                  <Field
                    name="admission_date"
                    component="input"
                    type="date"
                    placeholder="2021/12/12"
                    disabled={!isEditable}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label bold-text">Death Date</span>
                <div className="form__form-group-field">
                  <Field
                    name="death_date"
                    component="input"
                    type="date"
                    placeholder="2021/12/12"
                    disabled={!isEditable}
                  />
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label bold-text">Discharged Date</span>
                <div className="form__form-group-field">
                  <Field
                    name="discharged_date"
                    component="input"
                    type="date"
                    placeholder="2021/12/12"
                    disabled={!isEditable}
                  />
                </div>
              </div>
            </div>
            <ButtonToolbar className="form__button-toolbar">
              <Row className="mt-4">
                <Col md={12}>
                  <button type="button" className="btn btn-warning" onClick={() => setEditable(!isEditable)}>
                    {' '}
                    {!isEditable ? 'Edit' : 'Cancel'}
                  </button>
                  {isEditable && (
                    <button type="submit" className="btn btn-primary">
                      {' '}
                      Update
                    </button>
                  )}
                </Col>
              </Row>
            </ButtonToolbar>
          </form>
          <hr />
          <Soap patient={data} />
        </CardBody>
      </Card>
    </Col>
  );
};

export default reduxForm({
  form: 'update_patient_form', // a unique identifier for this form
})(PatientDataDetails);
