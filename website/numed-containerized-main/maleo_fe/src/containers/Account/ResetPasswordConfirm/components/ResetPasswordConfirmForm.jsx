import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, Form } from 'redux-form';
import { Button } from 'reactstrap';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import EyeIcon from 'mdi-react/EyeIcon';

const ResetPasswordConfirmForm = ({
  handleSubmit, fieldUser,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const toggleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleShowPasswordConfirm = (e) => {
    e.preventDefault();
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  return (
    <Form className="form reset-password-form" onSubmit={handleSubmit}>
      <div className="form__form-group">
        <div>
          <span className="form__form-group-label">{fieldUser}</span>
        </div>
        <span className="form__form-group-label">New Pssword</span>
        <div className="form__form-group-field">
          <div className="form__form-group-icon">
            <KeyVariantIcon />
          </div>
          <Field
            name="new_password"
            component="input"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            className="input-without-border-radius"
          />
          <button
            type="button"
            className={`form__form-group-button${showPassword ? ' active' : ''}`}
            onClick={toggleShowPassword}
          ><EyeIcon />
          </button>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Confirm New Pssword</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="confirmpassword"
              component="input"
              type={showPasswordConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
              className="input-without-border-radius"
            />
            <button
              type="button"
              className={`form__form-group-button${showPasswordConfirm ? ' active' : ''}`}
              onClick={toggleShowPasswordConfirm}
            ><EyeIcon />
            </button>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="account__btn"
        color="primary"
      >
        Reset Password
      </Button>
    </Form>
  );
};

ResetPasswordConfirmForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  fieldUser: PropTypes.shape(),
};

ResetPasswordConfirmForm.defaultProps = {
  fieldUser: null,
};

export default reduxForm({
  form: 'resetpasswordconfirm_form',
})(ResetPasswordConfirmForm);
