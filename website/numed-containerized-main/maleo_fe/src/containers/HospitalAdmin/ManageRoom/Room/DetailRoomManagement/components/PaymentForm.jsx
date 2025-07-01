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
import { ROOM_MANAGEMENT, BUILDING_MANAGEMENT } from '../../../../../../utils/EndPoints';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import renderSelectField from '../../../../../../shared/components/form/Select';
import renderCheckBoxField from '../../../../../../shared/components/form/CheckBox';

const DetailPartners = (stateOri) => {
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
  const [building, setBuilding] = useState([]);
  const [loading, setLoading] = useState(false);
  const buildingList = loading && building
    ? loading && building.map((e) => ({
      value: `${e.id}`, label: `${e.name}`,
    })) : [];

  useEffect(() => {
    initialize(data);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(BUILDING_MANAGEMENT, options)
      .then((res) => {
        setBuilding(res.data);
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
          updatedData.append('room_name', [e.target.room_name][0].value);
          updatedData.append('room_number', [e.target.room_number][0].value);
          updatedData.append('is_active', [e.target.is_active][0].checked);
          if (e.target.building) {
            updatedData.append('building_id', [e.target.building_id][0].value);
          }
          const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
          const options = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          };
          axios.patch(`${ROOM_MANAGEMENT}${params.id}/`, updatedData, options)
            .then(() => {
              history.push({
                pathname: '/hospital/room/',
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
            <Field
              name="room_name"
              component="input"
              type="text"
              placeholder="Name"
              disabled={!isEditable}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Room Number</span>
          <div className="form__form-group-field">
            <Field
              name="room_number"
              component="input"
              type="number"
              placeholder="Room Number"
              disabled={!isEditable}
            />
          </div>
        </div>
        {/* <div className="form__form-group">
          <span className="form__form-group-label">Room Active</span>
          <div className="form__form-group-field">
            <Field
              name="is_active"
              component="input"
              type="checkbox"
            />
          </div>
        </div> */}
        <div className="form__form-group">
          <span className="form__form-group-label">Building</span>
          <div className="form__form-group-field">
            <Field
              name="building_id"
              component="input"
              type="text"
              placeholder="Name"
              disabled
            />
          </div>
          {
            isEditable
          && (
          <div className="form__form-group-field">
            <Field
              name="building"
              component={renderSelectField}
              type="text"
              placeholder="Please select an option"
              options={buildingList || [
                { value: 'one', label: 'Not Found' },
              ]}
              required
            />
          </div>
          )
          }
        </div>
        <div className="form__form-group">
          {/* <span className="form__form-group-label">Room Active</span> */}
          <div className="form__form-group-field">
            <Field
              name="is_active"
                  // component="input"
              component={renderCheckBoxField}
              defaultChecked={data.is_active}
              disabled={!isEditable}
              type="checkbox"
              label="Room Active"
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
                    axios.delete(`${ROOM_MANAGEMENT}${params.id}/`, options)
                      .then(() => {
                        history.push({
                          pathname: '/hospital/room/',
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
