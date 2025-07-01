/* eslint-disable arrow-parens */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Col, Spinner, Alert,
} from 'reactstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import CommunityAddForm from './CommunityAddForm';
import { BUILDING_MANAGEMENT } from '../../../../../../utils/EndPoints';
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
    data.append('name', [e.target.name][0].value);
    data.append('hospital_id', [e.target.hospital_id][0].value);
    // data.append('image', [e.target.image][0].files[0]);

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.post(BUILDING_MANAGEMENT, data, options)
      .then(() => {
        // window.location.reload();
        // console.log('e', e.data.id);
        errorHandling('Data Berhasil Ditambahkan');
        history.push({
          pathname: '/hospital/building/',
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
            <h5 className="bold-text">Add Building Information</h5>
          </div>
          {isAlertOn && <Alert onClick={() => setAlert(false)} color="danger">{errorMsg}</Alert>}
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
