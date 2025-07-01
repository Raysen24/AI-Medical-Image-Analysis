import React from 'react';
import {
  Col, Container, Row,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import UserActivitySummary from './components/UserActivitySummary';
import HistoryVisits from './components/HistoryVisits';
// import LocationSummary from './components/LocationSummary';
import TotalVisits from './components/TotalVisits';

const DashboardSystemAdmin = () => {
  const { t } = useTranslation('common');
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">{t('system_admin.dashboard.page_title')}</h3>
        </Col>
      </Row>
      <Row>
        <TotalVisits />
        <HistoryVisits />
        <UserActivitySummary />
      </Row>
    </Container>
  );
};
export default DashboardSystemAdmin;
