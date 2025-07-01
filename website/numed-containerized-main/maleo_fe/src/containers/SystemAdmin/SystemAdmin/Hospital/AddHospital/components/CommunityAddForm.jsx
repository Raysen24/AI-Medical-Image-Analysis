/* eslint-disable no-sequences */
/* eslint-disable import/no-unresolved */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, ButtonToolbar, Card, CardBody, Col, Alert,
} from 'reactstrap';
import { Field, reduxForm } from 'redux-form';
// import renderSelectField from '../../../../../../shared/components/form/Select';

const CommunityAddForm = ({
  errorMessage, handleSubmit, status,
}) => (
  <Col xs={12} md={12} lg={12}>
    <Card>
      <CardBody className="dashboard__booking-card">
        <form className="form form--horizontal" onSubmit={handleSubmit}>
          <div className="form__form-group">
            <span className="form__form-group-label">Name</span>
            <div className="form__form-group-field">
              <Field
                name="name"
                component="input"
                type=""
                placeholder="Name"
              />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">Address</span>
            <div className="form__form-group-field">
              <Field
                name="address"
                component="textarea"
                type=""
                placeholder="Address"
              />
            </div>
          </div>
          <div className="form__form-group">
            <span className="form__form-group-label">Phone</span>
            <div className="form__form-group-field">
              <Field
                name="phone"
                component="input"
                type=""
                placeholder="Phone"
              />
            </div>
          </div>
          {/* <div className="form__form-group">
            <span className="form__form-group-label">Admin Hospital</span>
            <div className="form__form-group-field">
              <Field
                name="select"
                component={renderSelectField}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                ]}
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
            <Button color="primary" type="submit">Submit</Button>
          </ButtonToolbar>
        </form>
      </CardBody>
    </Card>
  </Col>
);

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
