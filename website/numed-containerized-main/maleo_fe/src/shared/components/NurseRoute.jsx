/* eslint-disable no-console */
/* eslint-disable no-undef */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { roleValidation } from '../../utils/helpers';

const NurseRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      roleValidation() === 'Nurse'
      || roleValidation() === 'Hospital Admin'
        ? <Component {...props} />
        : <Redirect to="/nurse/index" />
    )}
  />
);

NurseRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default NurseRoute;
