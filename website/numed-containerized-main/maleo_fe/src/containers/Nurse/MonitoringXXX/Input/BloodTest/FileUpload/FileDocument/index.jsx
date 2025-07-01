/* eslint-disable no-shadow */
/* eslint-disable no-console */
import React from 'react';
import {
  Col, Container, Row,
} from 'reactstrap';
import FileDocument from './components/FileUploadBloodTestForm';

const BloodTestFileUpload = () => (
  <Container className="dashboard">
    <Row>
      <Col md={12} lg={12}>
        <h3 className="page-title">Upload File Blood Test</h3>
      </Col>
    </Row>
    <FileDocument />
  </Container>

);

export default BloodTestFileUpload;
