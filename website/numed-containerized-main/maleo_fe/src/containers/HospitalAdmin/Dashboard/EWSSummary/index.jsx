/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Col, Container, Row, Card, CardBody,
} from 'reactstrap';
import axios from 'axios';
import { LOCALSTORAGE_TOKEN } from '../../../../utils/Types';

const EWSSummary = () => {
  const [ews, setEWS] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setInterval(() => {
      const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      axios.get('SCHEMA://SERVER_ADDRESS/api/v1/iot/data/real', options)
        .then((res) => {
          setEWS(res.data);
          setLoading(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000);
  }, []);
  return (
    <Col md={12} xl={12} lg={12} xs={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <Container className="dashboard">
            <Row>
              <Col md={12}>
                <h3 className="page-title">Early Warning Score Summary</h3>
              </Col>
            </Row>
            <Row>
              <Col md={12} xl={4} lg={6} xs={12}>
                <Card>
                  <CardBody className="dashboard__card-widget" style={{ border: '1px solid red', borderRadius: '10px' }}>
                    <div className="mobile-app-widget">
                      <div className="mobile-app-widget__top-line mobile-app-widget__top-line--pink">
                        <p className="mobile-app-widget__total-stat">{loading && ews.ews[0]} %</p>
                      </div>
                      <div className="mobile-app-widget__title">
                        <h5>Red Category</h5>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={12} xl={4} lg={6} xs={12}>
                <Card>
                  <CardBody className="dashboard__card-widget" style={{ border: '1px solid yellow', borderRadius: '10px' }}>
                    <div className="mobile-app-widget">
                      <div className="mobile-app-widget__top-line mobile-app-widget__top-line--yellow">
                        <p className="mobile-app-widget__total-stat">{loading && ews.ews[1]} %</p>
                      </div>
                      <div className="mobile-app-widget__title">
                        <h5>Yellow Category</h5>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={12} xl={4} lg={6} xs={12}>
                <Card>
                  <CardBody className="dashboard__card-widget" style={{ border: '1px solid green', borderRadius: '10px' }}>
                    <div className="mobile-app-widget">
                      <div className="mobile-app-widget__top-line mobile-app-widget__top-line--lime">
                        <p className="mobile-app-widget__total-stat">{loading && ews.ews[2]} %</p>
                      </div>
                      <div className="mobile-app-widget__title">
                        <h5>Green Category</h5>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </CardBody>
      </Card>
    </Col>
  );
};

export default connect((state) => ({
  rtl: state.rtl,
}))(EWSSummary);
