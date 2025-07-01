/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import {
  Card, CardBody, Col,
} from 'reactstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
// import TrendingUpIcon from 'mdi-react/TrendingUpIcon';
import { LOCALSTORAGE_TOKEN } from '../../../../../../../utils/Types';
import { CXR_MEDICALRECORD } from '../../../../../../../utils/EndPoints';
import Ava1 from '../../../../../../../shared/img/assets/cxr_pneumonia.png';

const VSRResultSaturation = () => {
  const params = useParams();
  const [cxrRecord, setcxrRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  // console.log(params);
  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(`${CXR_MEDICALRECORD}${params.id}/`, options)
      .then((res) => {
        setcxrRecord(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // const Ava1 = `${process.env.PUBLIC_URL}/img/11.png`;

  return (
    <Col md={12} xl={4} lg={6} xs={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="dashboard__booking-total-container">
            <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
              {loading ? cxrRecord.pneumonia.toFixed(2) : ''}%
            </h5>
            <div className="dashboard__competitor-img">
              <img src={Ava1} alt="" />
            </div>
          </div>
          <h5 className="dashboard__booking-total-description">02 Saturation</h5>
        </CardBody>
      </Card>
    </Col>
  );
};

export default VSRResultSaturation;
