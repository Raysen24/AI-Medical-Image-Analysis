/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  ButtonToolbar, Col, Row, Container,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { USERS_ALL, HOSPITAL_DETAIL } from '../../../../../../utils/EndPoints';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import renderSelectField from '../../../../../../shared/components/form/Select';

const DetailUserManagementForm = (stateOri) => {
  const history = useHistory();
  const params = useParams();
  const [isEditable, setEditable] = useState(false);
  const { location } = history;
  const { state } = location;
  const { data } = state;
  // console.log('data', data);
  const { initialize } = stateOri;

  const [userHospital, setuserHospital] = useState([]);
  const [loading, setLoading] = useState(false);
  const hospitalList = loading && userHospital
    ? userHospital.map((e) => ({
      value: `${e.id}`,
      label: `${e.name}`,
    }))
    : [];

  // console.log('sasas', hospitalList);
  useEffect(() => {
    initialize(data);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    axios
      .get(HOSPITAL_DETAIL, options)
      .then((res) => {
        // console.log('res data', res.data);
        setuserHospital(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Container>
      <form
        className="form form--horizontal"
        onSubmit={(e) => {
          e.preventDefault();
          const updatedData = new FormData();
          updatedData.append('fullname', [e.target.fullname][0].value);
          updatedData.append('role', [e.target.role_edit][0].value);
          updatedData.append('phone', [e.target.phone][0].value);
          if ([e.target.hospital][0].value) {
            updatedData.append('hospital', [e.target.hospital][0].value);
          }

          const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
          const options = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          };
          axios
            .patch(`${USERS_ALL}${params.id}/`, updatedData, options)
            .then(() => {
              history.push({
                pathname: '/dashboard/user',
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        <div className="form__form-group">
          <span className="form__form-group-label">Email</span>
          <div className="form__form-group-field">
            <Field name="email" component="input" type="email" placeholder="Email" disabled />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Username</span>
          <div className="form__form-group-field">
            <Field name="fullname" component="input" type="" placeholder="Name" disabled={!isEditable} />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Role</span>
          <div className="form__form-group-field">
            <Field name="role" component="input" disabled />
          </div>
          {isEditable && (
            <div className="form__form-group-field">
              <Field
                name="role_edit"
                component={renderSelectField}
                type="text"
                placeholder="Select One"
                options={[
                  { value: 'System Admin', label: 'System Admin' },
                  { value: 'Hospital Admin', label: 'Hospital Admin' },
                  { value: 'Hospital Management', label: 'Hospital Management' },
                  { value: 'Doctor', label: 'Doctor' },
                  { value: 'Patient', label: 'Patient' },
                  { value: 'Nurse', label: 'Nurse' },
                ]}
                disabled={!isEditable}
              />
            </div>
          )}
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Phone</span>
          <div className="form__form-group-field">
            <Field name="phone" component="input" type="" placeholder="Phone" disabled={!isEditable} />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Hospital</span>
          <div className="form__form-group-field">
            <Field name="" component="input" type="text" placeholder={data.hospital_list[0] ? data.hospital_list[0].name : '-'} disabled />
          </div>
          {isEditable && (
            <div className="form__form-group-field">
              <Field name="hospital" component={renderSelectField} type="text" placeholder="Select One" options={hospitalList || [{ value: 'one', label: 'One' }]} disabled={!isEditable} />
            </div>
          )}
        </div>
        <ButtonToolbar className="form__button-toolbar">
          <Row className="mt-4">
            <Col md={12}>
              <button type="button" className="btn btn-secondary" onClick={() => setEditable(!isEditable)}>
                {' '}
                {!isEditable ? 'Edit' : 'Cancel'}
              </button>
              {isEditable && (
                <button type="submit" className="btn btn-primary">
                  {' '}
                  Update
                </button>
              )}
              {isEditable === false && (
                <button
                  type="button"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    const updatedDataDelete = new FormData();
                    updatedDataDelete.append('is_active', false);

                    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
                    const options = {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                      },
                    };
                    axios
                      .patch(`${USERS_ALL}${params.id}/`, updatedDataDelete, options)
                      .then(() => {
                        history.push({
                          pathname: '/dashboard/user',
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                  className="btn btn-danger"
                >
                  {' '}
                  Inactive
                </button>
              )}
            </Col>
          </Row>
        </ButtonToolbar>
      </form>
    </Container>
  );
};

export default connect()(
// mapStateToProps,
// mapDispatchToProps, // bind account loading action creator
  reduxForm({
    form: 'user-management_edit_form', // a unique identifier for this form
    enableReinitialize: true,
  })(DetailUserManagementForm),
);
