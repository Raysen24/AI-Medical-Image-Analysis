import React from 'react';
// import { Link } from 'react-router-dom';
import {
  Card, CardBody, Col,
} from 'reactstrap';
import HumanGreetingIcon from 'mdi-react/HumanGreetingIcon';
import CheckboxMarkedCircleIcon from 'mdi-react/CheckboxMarkedCircleIcon';

const EmailConfirmationCard = () => (
  <Col md={12}>
    <Card>
      <CardBody>
        <div className="email-confirmation">
          <div className="email-confirmation__icon">
            <HumanGreetingIcon className="email-confirmation__mail" />
            <CheckboxMarkedCircleIcon className="email-confirmation__check" />
          </div>
          <h3 className="email-confirmation__title">Welcome to Numed AI System</h3>
          <p className="email-confirmation__sub">Thank you for colaborating with us</p>
          {/* <ButtonToolbar className="email-confirmation__buttons">
            <Link className="btn btn-primary" to="/online_marketing_dashboard">Go to dashboard</Link>
            <Link className="btn btn-primary" to="/account/profile">Go to profile</Link>
          </ButtonToolbar> */}
        </div>
      </CardBody>
    </Card>
  </Col>
);

export default EmailConfirmationCard;
