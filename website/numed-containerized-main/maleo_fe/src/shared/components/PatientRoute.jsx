/* eslint-disable no-console */
/* eslint-disable no-undef */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { roleValidation } from '../../utils/helpers';

const PatientRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      roleValidation() === 'Patient'
        ? <Component {...props} />
        : <Redirect to="/patient/index" />
    )}
  />
);

PatientRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default PatientRoute;
