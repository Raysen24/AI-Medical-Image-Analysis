/* eslint-disable no-console */
/* eslint-disable no-undef */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { roleValidation } from '../../utils/helpers';

const HospitalNursePatientRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      roleValidation() === 'Patient'
      || roleValidation() === 'Nurse'
      || roleValidation() === 'Doctor'
      || roleValidation() === 'Hospital Admin'
      || roleValidation() === 'System Admin'
        ? <Component {...props} />
        : <Redirect to="/account/welcome-statement/" />
    )}
  />
);

HospitalNursePatientRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default HospitalNursePatientRoute;
