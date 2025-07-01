/* eslint-disable no-console */
/* eslint-disable no-undef */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { roleValidation } from '../../utils/helpers';

const AdminRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      roleValidation() === 'Hospital Management'
        ? <Component {...props} />
        : <Redirect to="/account/welcome-statement/" />
    )}
  />
);

AdminRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default AdminRoute;
