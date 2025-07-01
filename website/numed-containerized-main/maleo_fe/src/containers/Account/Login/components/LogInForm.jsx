/* eslint-disable max-len */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import { Button } from 'reactstrap';

const LogInForm = ({ handleSubmit }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const showPassword = () => {
    setIsPasswordShown(!isPasswordShown);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form__form-group">
        <span className="form__form-group-label">Username</span>
        <div className="form__form-group-field">
          <div className="form__form-group-icon">
            <AccountOutlineIcon />
          </div>
          <Field
            name="email"
            component="input"
            type="email"
            placeholder="Your Email"
          />
        </div>
      </div>
      <div className="form__form-group mb-4">
        <span className="form__form-group-label">Password</span>
        <div className="form__form-group-field">
          <div className="form__form-group-icon">
            <KeyVariantIcon />
          </div>
          <Field
            name="password"
            component="input"
            type={isPasswordShown ? 'text' : 'password'}
            placeholder="Password"
          />
          <button
            className={`form__form-group-button${isPasswordShown ? ' active' : ''}`}
            onClick={() => showPassword()}
            type="button"
          ><EyeIcon />
          </button>
          <div className="account__forgot-password">
            <NavLink to="/reset_password">Forgot a password?</NavLink>
          </div>
        </div>
      </div>
      <Button type="submit" color="primary" className="account__btn mt-4">
        Login
      </Button>
      <h4 className="account__subhead subhead">Do not have an account? <NavLink to="/register">Register Now!</NavLink></h4>
    </form>
  );
};

LogInForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'log_in_form',
})(LogInForm);
