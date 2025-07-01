import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container, Row, ButtonToolbar, Button, Col,
} from 'reactstrap';
import PatientInformationForm from './components/PatientInformationForm';

const PatientInformation = () => {
  const history = useHistory();
  return (
    <Container className="dashboard">
      <ButtonToolbar className="form__button-toolbar">
        <Button color="primary" onClick={history.goBack}>
          Back
        </Button>
      </ButtonToolbar>
      <Row>
        <Col md={12}>
          <h3 className="page-title">Patient Information</h3>
        </Col>
      </Row>
      <Row>
        <PatientInformationForm />
      </Row>
    </Container>
  );
};

export default (PatientInformation);
