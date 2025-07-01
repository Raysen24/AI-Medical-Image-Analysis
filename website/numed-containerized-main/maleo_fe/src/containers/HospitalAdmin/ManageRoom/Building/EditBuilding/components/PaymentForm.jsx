/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  ButtonToolbar, Col, Row, Alert, Container,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { BUILDING_MANAGEMENT } from '../../../../../../utils/EndPoints';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';

const DetailPartners = (stateOri) => {
  const history = useHistory();
  const params = useParams();
  const [isEditable, setEditable] = useState(false);
  const { updateResponse, updateData } = stateOri;
  const { location } = history;
  const { state } = location;
  const { data } = state;
  console.log(data);
  const { initialize } = stateOri;
  if (updateData) {
    initialize(updateData);
  }

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
          updatedData.append('name', e.target.name.value);
          updatedData.append('hospital_id', data.hospital_id);
          const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
          const options = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          };
          axios.patch(`${BUILDING_MANAGEMENT}${params.id}/`, updatedData, options)
            .then(() => {
              history.push({
                pathname: '/hospital/building/',
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        <div className="form__form-group">
          <span className="form__form-group-label">Hospital</span>
          <div className="form__form-group-field">
            <Field
              // name="hospital_id"
              component="input"
              type="text"
              placeholder={data.hospital_detail.name}
              defaultValue={data.hospital_detail.name}
              value={data.hospital_detail.name}
              disabled
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Name</span>
          <div className="form__form-group-field">
            <Field
              name="name"
              component="input"
              type="text"
              placeholder="Name"
              disabled={!isEditable}
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
                    axios.delete(`${BUILDING_MANAGEMENT}${params.id}/`, options)
                      .then(() => {
                        history.push({
                          pathname: '/hospital/building/',
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                  className="btn btn-danger"
                > Delete
                </button>
              )}
            </Col>
          </Row>
        </ButtonToolbar>
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
    </Container>
  );
};

export default connect(
  // mapStateToProps,
  // mapDispatchToProps, // bind account loading action creator
)(reduxForm({
  form: 'partner_edit_form', // a unique identifier for this form
  enableReinitialize: true,
})(DetailPartners));
