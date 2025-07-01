import React from 'react';
import {
  Button, ButtonToolbar, Container, Row,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import PaymentCard from './components/PaymentCard';

const EditBuilding = () => {
  const history = useHistory();
  return (

    <Container className="dashboard">
      <ButtonToolbar className="form__button-toolbar">
        <Button color="primary" onClick={history.goBack}>
          Back
        </Button>
      </ButtonToolbar>

      <Row>
        <PaymentCard />
      </Row>
    </Container>
  );
};

export default EditBuilding;
