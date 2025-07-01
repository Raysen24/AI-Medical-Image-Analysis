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
import { BUILDING_MANAGEMENT } from '../../../../../../utils/EndPoints';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import renderSelectField from '../../../../../../shared/components/form/Select';
import renderCheckBoxField from '../../../../../../shared/components/form/CheckBox';

const CommunityAddForm = ({
  errorMessage, handleSubmit, status,
}) => {
  const [building, setBuilding] = useState([]);
  const [loading, setLoading] = useState(false);
  const buildingList = loading && building
    ? loading && building.map((e) => ({
      value: `${e.id}`, label: `${e.name}`,
    })) : [];

  useEffect(() => {
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
    <Col xs={12} md={12} lg={12}>
      <Card>
        <CardBody>
          <form className="form form--horizontal" onSubmit={handleSubmit}>
            <div className="form__form-group">
              <span className="form__form-group-label">Name</span>
              <div className="form__form-group-field">
                <Field
                  name="room_name"
                  component="input"
                  type="text"
                  placeholder="Name"
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
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">Building</span>
              <div className="form__form-group-field">
                <Field
                  name="building_id"
                  component={renderSelectField}
                  type="text"
                  placeholder="Please select an option"
                  options={buildingList || [
                    { value: 'one', label: 'Not Found' },
                  ]}
                  required
                />
              </div>
            </div>
            <div className="form__form-group">
              {/* <span className="form__form-group-label">Room Active</span> */}
              <div className="form__form-group-field">
                <Field
                  name="is_active"
                  // component="input"
                  component={renderCheckBoxField}
                  type="checkbox"
                  label="Room Active"
                  // className="colored-click"
                />
              </div>
            </div>
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
