/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import {
  Card, CardBody, Col,
} from 'reactstrap';
import axios from 'axios';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import { VITAL_SIGN } from '../../../../../../utils/EndPoints';
import Ava1 from '../../../../../../shared/img/assets/blood_pressure.png';

const VSRResultBloodPressure = () => {
  const [vsr, setVSR] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(vsr && loading);
  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(VITAL_SIGN, options)
      .then((res) => {
        setVSR(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const Ava1 = `${process.env.PUBLIC_URL}/img/11.png`;

  return (
    <Col md={12} xl={3} lg={12} xs={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="dashboard__booking-total-container">
            <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
              {loading && vsr[0] ? vsr[0].blood_pressure.toFixed(1) : ''}
            </h5>
            <div className="dashboard__competitor-img">
              <img src={Ava1} alt="" />
            </div>
          </div>
          <h5 className="dashboard__booking-total-description">Blood Pressure (mmHg)</h5>
        </CardBody>
      </Card>
    </Col>
  );
};

export default VSRResultBloodPressure;
