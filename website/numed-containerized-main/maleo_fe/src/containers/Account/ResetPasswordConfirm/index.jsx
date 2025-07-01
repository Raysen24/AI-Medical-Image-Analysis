/* eslint-disable max-len */
// import axios from 'axios';
import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Col, Row } from 'reactstrap';
import { RESETPASSWORDCONFIRM } from '../../../utils/EndPoints';
// import { RESETPASSWORDCONFIRM } from '../../../utils/EndPoints';
import ResetPasswordConfirmForm from './components/ResetPasswordConfirmForm';

const ResetPasswordConfirm = () => {
  const [alert, setAlert] = useState('');
  const params = useParams();
  const onSubmit = (e) => {
    // eslint-disable-next-line no-console
    // console.log('ini onsubmit', e.email);
    const data = new FormData();
    data.append('token', params.token);
    data.append('password', e.new_password);
    axios.post(RESETPASSWORDCONFIRM, data)
      .then((res) => {
        setAlert(res.data.status);
      })
      .catch((err) => {
        setAlert(err.response.data);
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
                    Password Anda berhasil dirubah, silahkan login kembali.
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
                    Perubahan password gagal.
                  </p>
                </Alert>
              </Col>
            </Row>
          )}
          <ResetPasswordConfirmForm
            onSubmit={(e) => onSubmit(e)}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
