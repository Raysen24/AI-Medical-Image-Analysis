/* eslint-disable max-len */
import axios from 'axios';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Alert, Col, Row } from 'reactstrap';
import { RESETPASSWORD } from '../../../utils/EndPoints';
import ResetPasswordForm from './components/ResetPasswordForm';

const ResetPasswords = () => {
  const [alert, setAlert] = useState('');

  const onSubmit = (e) => {
    // eslint-disable-next-line no-console
    // console.log('ini onsubmit', e.email);
    const data = new FormData();
    data.append('email', e.email);
    axios.post(RESETPASSWORD, data)
      .then((res) => {
        setAlert(res.data.status);
      })
      .catch((err) => {
        setAlert(err.response.data.email[0]);
      });
  };

  return (
    <div className="account account--not-photo">
      <div className="account__wrapper">
        <div className="account__card">
          <div className="account__head">
            <h3 className="account__title">NUMED
              <span className="account__logo">
                <span className="account__logo-accent ml-2">BINUS</span>
              </span>
            </h3>
            <h4 className="account__subhead subhead">Password Reset</h4>
          </div>
          {alert !== '' && alert === 'OK' && (
            <Row>
              <Col md={12}>
                <Alert className="container mb-4 p-1" color="success">
                  <p>
                    Request lupa password berhasil dikirim ke email.
                  </p>
                </Alert>
              </Col>
            </Row>
          )}
          {alert !== '' && alert === "We couldn't find an account associated with that email. Please try a different e-mail address." && (
            <Row>
              <Col md={12}>
                <Alert className="container mb-4 p-1" color="danger">
                  <p>
                    Email Anda tidak terdaftar dalam sistem.
                  </p>
                </Alert>
              </Col>
            </Row>
          )}
          <ResetPasswordForm
            onSubmit={(e) => onSubmit(e)}
            form="reset_password_form"
          />
          <div className="account__have-account">
            <p>Remember your password?  <NavLink to="/log_in">Login</NavLink></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswords;
