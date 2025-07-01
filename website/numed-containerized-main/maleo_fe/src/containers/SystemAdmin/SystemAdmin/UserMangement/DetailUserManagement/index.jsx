import React from 'react';
import {
  Container, Row, ButtonToolbar, Button,
} from 'reactstrap';
// import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import DetailUserManagementCard from './components/DetailUserManagementCard';

const DetailUserManagement = () => {
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
          <h3 className="page-title">{t('system_admin.system_admin.page_title_detail')}</h3>
        </Col>
      </Row> */}
      <Row>
        <DetailUserManagementCard />
      </Row>
    </Container>
  );
};

export default DetailUserManagement;
