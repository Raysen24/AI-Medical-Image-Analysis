/* eslint-disable no-console */
/* eslint-disable no-sequences */
/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button, ButtonToolbar, Card, CardBody, Col, Alert,
} from 'reactstrap';
import axios from 'axios';
import { Field, reduxForm } from 'redux-form';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import renderSelectField from '../../../../../../shared/components/form/Select';
import { ROOM_MANAGEMENT } from '../../../../../../utils/EndPoints';
// import renderCheckBoxField from '../../../../../../shared/components/form/CheckBox';

const CommunityAddForm = ({
  errorMessage, handleSubmit, status,
}) => {
  const [hospital, setHospital] = useState([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const hospitalList = hospitalLoading && hospital
    ? hospitalLoading && hospital.map((e) => ({
      value: `${e.id}`, label: `${e.room_name}`,
    })) : [];

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(ROOM_MANAGEMENT, options)
      .then((res) => {
        setHospital(res.data);
        setHospitalLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Col xs={12} md={12} lg={12}>
      <Card>
        <CardBody>
          <form className="form form--horizontal" onSubmit={handleSubmit}>
            <div className="form__form-group">
              <span className="form__form-group-label">Room</span>
              <div className="form__form-group-field">
                <Field
                  name="room_id"
                  component={renderSelectField}
                  type="text"
                  placeholder="Please select an option"
                  options={hospitalList || [
                    { value: 'one', label: 'Not Found' },
                  ]}
                  required
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">Total Bed</span>
              <div className="form__form-group-field">
                <Field
                  name="total_bed"
                  component="input"
                  type="number"
                  placeholder="Total Bed"
                />
              </div>
            </div>

            {/* <div className="form__form-group">
              <span className="form__form-group-label">Bed Number</span>
              <div className="form__form-group-field">
                <Field
                  name="bed_number"
                  component="input"
                  type="number"
                  placeholder="Number"
                />
              </div>
            </div>
            <div className="form__form-group">
              <div className="form__form-group-field">
                <Field
                  name="is_occupied"
                  component={renderCheckBoxField}
                  type="number"
                  label="Bed Occupied"
                />
              </div>
            </div> */}
            <div className="mb-3">
              <Alert
                color={status === 'success' ? 'success' : 'danger'}
                isOpen={!!errorMessage || status === 'success'}
              >
                <p className="p-2 pl-3">{status === 'success' ? 'Community Successfully Added' : errorMessage}</p>
              </Alert>
            </div>
            <ButtonToolbar className="form__button-toolbar">
              <Button color="primary" size="sm" type="submit">Submit</Button>
              <Button type="button" size="sm" href="/community/index">
                Cancel
              </Button>
            </ButtonToolbar>
          </form>
        </CardBody>
      </Card>
    </Col>
  );
};

CommunityAddForm.propTypes = {
  errorMessage: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

CommunityAddForm.defaultProps = {
  errorMessage: '',
};

export default reduxForm({
  form: 'community_add_form', // a unique identifier for this form
})(CommunityAddForm);
