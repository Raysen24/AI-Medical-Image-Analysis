/* eslint-disable no-console */
import React from 'react';
// import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import RegisterForm from './components/RegisterForm';

const RegisterAccounts = () => (
  <div className="account account--not-photo">
    <div className="account__wrapper">
      <div className="account__card2">
        <div className="account__head">
          <h3 className="account__title">NUMED
            <span className="account__logo">
              <span className="account__logo-accent ml-2">BINUS</span>
            </span>
          </h3>
          <h4 className="account__subhead subhead">Create an Account</h4>
        </div>
        <RegisterForm />
        <div className="account__have-account">
          <p>Already have an account? <NavLink to="/log_in">Login</NavLink></p>
        </div>
      </div>
    </div>
  </div>
);

// RegisterAccounts.propTypes = {
//   history: PropTypes.shape({
//     push: PropTypes.func,
//   }).isRequired,
// };

export default (RegisterAccounts);
