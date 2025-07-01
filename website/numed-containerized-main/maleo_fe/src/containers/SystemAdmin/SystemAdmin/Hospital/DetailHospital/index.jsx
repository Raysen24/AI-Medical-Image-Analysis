import React from 'react';
import {
  Container, Row, ButtonToolbar, Button,
} from 'reactstrap';
// import ListRoom from '../ListRoom';
import { useHistory } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import HospitalDetailCard from './components/HospitalDetailCard';

const HospitalDetail = () => {
  // const { t } = useTranslation('common');
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
          <h3 className="page-title">{t('system_admin.system_admin.hospital_detail')}</h3>
        </Col>
      </Row> */}
      <Row>
        <HospitalDetailCard />
      </Row>
    </Container>
  );
};
export default HospitalDetail;
