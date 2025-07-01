/* eslint-disable max-len */
/* eslint-disable arrow-parens */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Col, Spinner, Alert,
} from 'reactstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import CommunityAddForm from './CommunityAddForm';
import { BED_MANAGEMENT_CREATE } from '../../../../../../utils/EndPoints';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';

const CommunityCard = () => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [isAlertOn, setAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const errorHandling = (msg) => {
    setErrorMsg(` ${JSON.stringify(msg)}`);
    setLoading(false);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 10000);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('room_id', [e.target.room_id][0].value);
    data.append('total_bed', [e.target.total_bed][0].value);

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.post(BED_MANAGEMENT_CREATE, data, options)
      .then(() => {
        errorHandling('Data Berhasil Ditambahkan');
        history.push({
          pathname: '/hospital/bed/',
          // state: { data: listingAttendance },
        });
        setLoading(false);
      })
      .catch((error) => {
        errorHandling(error.response.data);
        setLoading(false);
      });
  };
  return (

    <Col md={12} lg={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">Input Bed Information</h5>
          </div>
          {isAlertOn && (
            <Alert onClick={() => setAlert(false)} color={errorMsg === 'Data Berhasil Ditambahkan' ? 'success' : 'danger'}>
              {errorMsg}
            </Alert>
          )}
          {loading ? <Spinner color="success" /> : ''}
          <CommunityAddForm
            handleSubmit={(e) => onSubmit(e)}
          />
        </CardBody>
      </Card>
    </Col>
  );
};

CommunityCard.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default (CommunityCard);
