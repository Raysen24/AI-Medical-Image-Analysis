/* eslint-disable no-lone-blocks */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Button,
} from 'reactstrap';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import CalendarBlankIcon from 'mdi-react/CalendarBlankIcon';
import { useTranslation } from 'react-i18next';
import renderSelectField from '../../../../../shared/components/form/Select';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../utils/Types';
import {
  MEDICALRECORD,
  BUILDING_BY_IDHOSPITAL, ROOM_BY_IDBUILDING, BED_BY_IDROOM,
} from '../../../../../utils/EndPoints';

const MedicalRecordForm = () => {
  const { t } = useTranslation('common');
  const params = useParams();
  const history = useHistory();

  // select option bersyarat
  const [hospitals, setHospitals] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);

  // selected from user detail
  const [statusPatient, setStatusPatient] = useState('');

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

  useEffect(() => {
    // get Hospitals user
    if (userDetail.hospital_list.length !== 0) {
      setHospitals(userDetail.hospital_list.map((e) => ({ value: `${e.id}`, label: `${e.name}` })));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const addmedicalrecord = new FormData();

    addmedicalrecord.append('patient_id', params.id);
    addmedicalrecord.append('mr_id_patient', [e.target.mr_id_patient][0].value);
    addmedicalrecord.append('patient_status', [e.target.patient_status][0].value);

    if ([e.target.hospital_id][0]) {
      addmedicalrecord.append('hospital_id', [e.target.hospital_id][0].value);
    }
    if ([e.target.building_id][0]) {
      addmedicalrecord.append('building_id', [e.target.building_id][0].value);
    }
    if ([e.target.room_id][0]) {
      addmedicalrecord.append('room_id', [e.target.room_id][0].value);
    }
    if ([e.target.bed_id][0]) {
      addmedicalrecord.append('bed_id', [e.target.bed_id][0].value);
    }
    addmedicalrecord.append('admission_date', [e.target.admission_date][0].value);
    addmedicalrecord.append('death_date', [e.target.death_date][0].value);
    addmedicalrecord.append('discharged_date', [e.target.discharged_date][0].value);

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.post(MEDICALRECORD, addmedicalrecord, options)
      .then(() => {
        // history.push({
        //   pathname: '/hospital/patient/list/',
        // });
        history.goBack();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Col xs={12} md={12} lg={12} xl={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <form
            className="form form--horizontal"
            onSubmit={handleSubmit}
          >
            <div className="form__form-group">
              <h5 className="bold-text">{t('patient.medical_record.new_medical')}</h5>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">MR.ID</span>
              <div className="form__form-group-field">
                <Field
                  name="mr_id_patient"
                  component="input"
                  type="text"
                  placeholder="patient medical record"
                  required
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Status</span>
              <div className="form__form-group-field">
                <Field
                  name="patient_status"
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

            {/* hospital, building, room, bed dikeluarkan kalau status inPatient */}
            {statusPatient === 'Inpatient' && (
              <>
                <div className="form__form-group">
                  <span className="form__form-group-label bold-text">Hospital</span>
                  <div className="form__form-group-field">
                    <Field
                      name="hospital_id"
                      component={renderSelectField}
                      options={hospitals || [
                        { value: 'one', label: 'Select One' },
                      ]}
                      placeholder="Select One"
                      onChange={(e) => {
                        axios.get(`${BUILDING_BY_IDHOSPITAL + e.value}`, options)
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
                      name="building_id"
                      component={renderSelectField}
                      options={buildings || [
                        { value: 'one', label: 'Room 1' },
                      ]}
                      placeholder="Select One"
                      onChange={(e) => {
                        axios.get(`${ROOM_BY_IDBUILDING + e.value}`, options)
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
                      name="room_id"
                      component={renderSelectField}
                      options={rooms || [
                        { value: 'one', label: 'Select One' },
                      ]}
                      placeholder="Select One"
                      onChange={(e) => {
                        axios.get(`${BED_BY_IDROOM + e.value}`, options)
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
                      name="bed_id"
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

            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Admission Date</span>
              <div className="form__form-group-field">
                <Field
                  name="admission_date"
                  component="input"
                  type="date"
                  placeholder="2021/12/12"
                />
                <div className="form__form-group-icon">
                  <CalendarBlankIcon />
                </div>
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
                />
                <div className="form__form-group-icon">
                  <CalendarBlankIcon />
                </div>
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
                />
                <div className="form__form-group-icon">
                  <CalendarBlankIcon />
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

export default reduxForm({
  form: 'medical_record_form', // a unique identifier for this form
})(MedicalRecordForm);
