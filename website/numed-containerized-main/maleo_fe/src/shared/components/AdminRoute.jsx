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
      roleValidation() === 'System Admin'
        ? <Component {...props} />
        : <Redirect to="/dashboard/admin" />
    )}
  />
);

AdminRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default AdminRoute;
