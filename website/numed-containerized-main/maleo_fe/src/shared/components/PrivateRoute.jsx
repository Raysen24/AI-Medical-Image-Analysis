/* eslint-disable arrow-parens */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isLogin } from '../../utils/helpers';

const PrivateRoute = ({ component: Component, ...rest }) => (
  // Show the component only when the user is logged in
  // Otherwise, redirect the user to /signin page
  <Route
    {...rest}
    render={(props) => (
      isLogin()
        ? <Component {...props} />
        : <Redirect to="/account/welcome-statement/" />
    )}
  />
);

PrivateRoute.propTypes = {
  component: PropTypes.node.isRequired,
};

export default PrivateRoute;
