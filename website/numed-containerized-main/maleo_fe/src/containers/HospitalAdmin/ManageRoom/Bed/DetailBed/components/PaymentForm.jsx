/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  ButtonToolbar, Col, Row, Alert, Container,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { BED_MANAGEMENT, ROOM_MANAGEMENT } from '../../../../../../utils/EndPoints';
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
      value: `${e.id}`, label: `${e.room_name}`,
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
    axios.get(ROOM_MANAGEMENT, options)
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
          updatedData.append('bed_number', [e.target.bed_number][0].value);
          updatedData.append('is_occupied', [e.target.is_occupied][0].checked);
          if (e.target.room.value !== '') {
            updatedData.append('room_id', [e.target.room][0].value);
          }
          const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
          const options = {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${token}`,
            },
          };
          axios.patch(`${BED_MANAGEMENT}${params.id}/`, updatedData, options)
            .then(() => {
              history.push({
                pathname: '/hospital/bed/',
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        <div className="form__form-group">
          <span className="form__form-group-label">Bed Number</span>
          <div className="form__form-group-field">
            <Field
              name="bed_number"
              component="input"
              type="number"
              placeholder="Room Number"
              disabled={!isEditable}
            />
          </div>
        </div>
        {/* <div className="form__form-group">
          <span className="form__form-group-label">Bed Occupied</span>
          <div className="form__form-group-field">
            <Field
              name="is_occupied"
              component="input"
              type="checkbox"
            />
          </div>
        </div> */}

        <div className="form__form-group">
          <span className="form__form-group-label">Room</span>
          <div className="form__form-group-field">
            <Field
              name="room_id"
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
              name="room"
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
          {/* <span className="form__form-group-label">Bed Occupied</span> */}
          <div className="form__form-group-field">
            <Field
              name="is_occupied"
              component={renderCheckBoxField}
              type="number"
              defaultChecked={data.is_occupied}
              disabled={!isEditable}
              label="Bed Occupied"
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

export default (reduxForm({
  form: 'partner_edit_form', // a unique identifier for this form
  enableReinitialize: true,
})(DetailPartners));
