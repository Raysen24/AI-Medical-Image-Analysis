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
import { HOSPITAL_DETAIL } from '../../../../../../utils/EndPoints';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';

const HospitalDetailtForm = (stateOri) => {
  const history = useHistory();
  const params = useParams();
  const [isEditable, setEditable] = useState(false);
  const { location } = history;
  const { state } = location;
  const { data } = state;
  const { initialize } = stateOri;
  useEffect(() => {
    initialize(data);
  }, []);

  return (
    <Container>
      <form
        className="form form--horizontal"
        onSubmit={(e) => {
          e.preventDefault();
          const updatedData = new FormData();
          updatedData.append('name', [e.target.name][0].value);
          updatedData.append('address', [e.target.address][0].value);
          updatedData.append('phone', [e.target.phone][0].value);

          const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
          const options = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          };
          axios
            .patch(`${HOSPITAL_DETAIL}${params.id}/`, updatedData, options)
            .then(() => {
              history.push({
                pathname: '/dashboard/hospital',
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        <div className="form__form-group">
          <span className="form__form-group-label">Name</span>
          <div className="form__form-group-field">
            <Field name="name" component="input" type="" placeholder="Name" disabled={!isEditable} />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Address</span>
          <div className="form__form-group-field">
            <Field name="address" component="textarea" type="" placeholder="Address" disabled={!isEditable} />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Phone</span>
          <div className="form__form-group-field">
            <Field name="phone" component="input" type="" placeholder="Phone" disabled={!isEditable} />
          </div>
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
                    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
                    const options = {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                      },
                    };
                    axios
                      .delete(`${HOSPITAL_DETAIL}${params.id}`, options)
                      .then(() => {
                        history.push({
                          pathname: '/dashboard/hospital',
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                  className="btn btn-danger"
                >
                  {' '}
                  Delete
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
    form: 'partner_edit_form', // a unique identifier for this form
    enableReinitialize: true,
  })(HospitalDetailtForm),
);
