import React from 'react';
import {
  Container, Row, ButtonToolbar, Button,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import CommunityAddCard from './components/CommunityAddCard';

const AddHospital = () => {
  const history = useHistory();
  return (
    <Container className="dashboard">
      <ButtonToolbar className="form__button-toolbar">
        <Button color="primary" onClick={history.goBack}>
          Back
        </Button>
      </ButtonToolbar>
      {/* <Row>
        <Col md={12}>
          <h3 className="page-title">Add Hospital</h3>
        </Col>
      </Row> */}
      <Row>
        <CommunityAddCard />
      </Row>
    </Container>
  );
};

export default AddHospital;
