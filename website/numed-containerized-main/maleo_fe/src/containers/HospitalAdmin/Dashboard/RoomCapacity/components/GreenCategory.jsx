import React, { useState } from 'react';

import {
  Card, CardBody, Col,
} from 'reactstrap';

const GreenCategory = () => {
  const [data, setData] = useState('');
  const wss = new WebSocket('wss://ec2-108-137-1-81.ap-southeast-3.compute.amazonaws.com/ws/123');
  wss.onmessage = (event) => {
    // console.log('wkwk', event);
    setData(event.data);
  };
  // console.log('data', data);
  return (
    <Col md={12} xl={4} lg={6} xs={12}>
      <Card>
        <CardBody className="dashboard__card-widget" style={{ border: '1px solid green', borderRadius: '10px' }}>
          <div className="mobile-app-widget">
            <div className="mobile-app-widget__top-line mobile-app-widget__top-line--lime">
              <p className="mobile-app-widget__total-stat">{data} %</p>
            </div>
            <div className="mobile-app-widget__title">
              <h5>Green Category</h5>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};
export default GreenCategory;
