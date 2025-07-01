/* eslint-disable max-len */
/* eslint-disable no-console */
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import LogInForm from './components/LogInForm';
import {
  AUTH_URL_LOGIN,
  AUTH_URL_USERME,
  LOGINACTIVITY,
} from '../../../utils/EndPoints';
import {
  LOCALSTORAGE_TOKEN,
  LOCALSTORAGE_USERDETAIL,
} from '../../../utils/Types';
import Alert from '../../../shared/components/Alert';

const LoginAccount = () => {
  const [isVisibleAlert, setVisibleAlert] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const history = useHistory();
  const errorHandling = () => {
    setLoading(false);
    setVisibleAlert(true);
    setTimeout(() => {
      setVisibleAlert(false);
    }, 5000);
  };
  const onSubmit = (e) => {
    const data = new FormData();
    data.append('email', e.email);
    data.append('password', e.password);
    setLoading(true);
    axios.post(AUTH_URL_LOGIN, data)
      .then((res) => {
        // authentication
        const token = res.data.auth_token;

        localStorage.setItem(LOCALSTORAGE_TOKEN, token);
        // authorization
        axios.get(AUTH_URL_USERME, { headers: { Authorization: `Token ${token}` } }).then((userData) => {
          // console.log('data', userData);
          const login = new FormData();
          login.append('user_id', userData.data.id);
          login.append('activity', 'Login');
          axios.post(LOGINACTIVITY, login, { headers: { Authorization: `Token ${token}` } })
            .then(() => {
              console.log('oke');
              // const numed = new FormData();
              // numed.append('username', 'test.numed@focmbinus.onmicrosoft.com');
              // numed.append('password', 'byornEXPERT1A!');
            }).catch((error) => {
              errorHandling(error.response.data);
            });

          const userdetail = userData.data;
          if (userdetail.role === 'System Admin') {
            localStorage.setItem(LOCALSTORAGE_USERDETAIL, JSON.stringify(userData.data));
            history.push('/dashboard/admin');
          } else if (userdetail.role === 'Patient') {
            localStorage.setItem(LOCALSTORAGE_USERDETAIL, JSON.stringify(userData.data));
            history.push('/patient/index');
          } else if (userdetail.role === 'Nurse') {
            localStorage.setItem(LOCALSTORAGE_USERDETAIL, JSON.stringify(userData.data));
            history.push('/nurse/index');
          } else if (userdetail.role === 'Doctor') {
            localStorage.setItem(LOCALSTORAGE_USERDETAIL, JSON.stringify(userData.data));
            history.push('/doctor/index');
          } else if (userdetail.role === 'Hospital Management') {
            localStorage.setItem(LOCALSTORAGE_USERDETAIL, JSON.stringify(userData.data));
            history.push('/management/index/');
          } else if (userdetail.role === 'Hospital Admin') {
            localStorage.setItem(LOCALSTORAGE_USERDETAIL, JSON.stringify(userData.data));
            history.push('/hospital/index');
          } else {
            errorHandling('Anda tidak memiliki hak untuk mengakses Educourse Report Management');
          }
          setLoading(false);
        }).catch((error) => {
          errorHandling(error.response.data);
        });
      }).catch((error) => {
        errorHandling(error.response.data);
      });
  };
  if (isLoading) {
    return (
      <div className="load">
        <div className="load__icon-wrap">
          <svg className="load__icon">
            <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
          </svg>
        </div>
      </div>
    );
  }
  return (
    <div className="account">
      <div className="account__wrapper">
        <div className="account__card">
          <div className="account__head">
            <h3 className="account__title">NUMED
              <span className="account__logo">
                <span className="account__logo-accent ml-2">BINUS</span>
              </span>
            </h3>
            <h4 className="account__subhead subhead">A New AI-based Telemedicine for COVID-19 Patients</h4>
          </div>
          {isVisibleAlert ? (
            <Alert visible={isVisibleAlert} color="danger">
              <p><span className="bold-text">Login Failed</span></p>
            </Alert>
          )
            : ''}
          <LogInForm onSubmit={(e) => onSubmit(e)} />
        </div>
      </div>
    </div>
  );
};

export default LoginAccount;
