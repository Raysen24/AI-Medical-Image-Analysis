import React from 'react';
import {
  Col, Container, Row, Card, CardBody,
} from 'reactstrap';
import VSRGraphBloodPressure from './components/VSRGraphBloodPressure';
import VSRGraphHeartRate from './components/VSRGraphHeartRate';
import VSRGraphRespiratoryRate from './components/VSRGraphRespiratoryRate';
import VSRGraphSaturation from './components/VSRGraphSaturation';
import VSRGraphTemperature from './components/VSRGraphTemperature';
import VSRResultBloodPressure from './components/VSRResultBloodPressure';
import VSRResultEWSScore from './components/VSRResultEWSScore';
import VSRResultHeartRate from './components/VSRResultHeartRate';
import VSRResultOxygenAid from './components/VSRResultOxygenAid';
import VSRResultRespiratoryRate from './components/VSRResultRespiratoryRate';
import VSRResultSaturation from './components/VSRResultSaturation';
import VSRResultTemperature from './components/VSRResultTemperature';
// import VSRResultCard from './components/VSRResultCard';
// import RelatedItems from './components/RelatedItems';

const VSRResult = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12}>
        <Card>
          <CardBody className="dashboard__title-card">
            <div>
              <div className="dashboard__title-card">
                <div className="product-card__info">
                  <h1 className="product-card__title">
                    Here are your
                    <span className="red-text"> AI Based Vital Sign</span> results!
                  </h1>
                  <h3 className="page-subhead subhead">Uploaded on Today
                  </h3>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
    <Row>
      <VSRResultBloodPressure />
      <VSRResultRespiratoryRate />
      <VSRResultSaturation />
      <VSRResultEWSScore />
    </Row>
    <Row>
      <VSRResultTemperature />
      <VSRResultHeartRate />
      <VSRResultOxygenAid />
    </Row>
    <Row>
      <VSRGraphBloodPressure />
      <VSRGraphRespiratoryRate />
    </Row>
    <Row>
      <VSRGraphSaturation />
      <VSRGraphHeartRate />
      <VSRGraphTemperature />
    </Row>
  </Container>
);

export default VSRResult;
