import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Col, Button, ButtonToolbar, Spinner,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import ReactTableBase from '../../../../../../../shared/components/table/ReactTableBase';

const DetailHandler = (history, info) => {
  history.push({
    pathname: `/patient-data/new-monitoring/${info}/`,
    state: { data: info },
  });
};
const MonitoringInputTable = ({ listDataTable, isLoading }) => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const params = useParams();

  const tableConfig = {
    isEditable: false,
    isSortable: true,
    isResizable: false,
    withPagination: true,
    withSearchEngine: true,
    manualPageSize: [10, 20, 30, 40],
    placeholder: 'Search...',
  };

  return (
    <Col md={12} lg={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">{t('patient.monitoring.page_title')}</h5>
            <ButtonToolbar className="products-list__btn-toolbar-top">
              <Button size="sm" color="warning" onClick={() => DetailHandler(history, params.id)}>
                {t('patient.monitoring.btn_new')}
              </Button>
            </ButtonToolbar>
          </div>
          {isLoading ? <Spinner /> : (
            <ReactTableBase
              columns={listDataTable.tableHeaderData}
              data={listDataTable.tableRowsData}
              tableConfig={tableConfig}
            />
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

MonitoringInputTable.propTypes = {
  listDataTable: PropTypes.shape({
    tableHeaderData: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
    })),
    tableRowsData: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default MonitoringInputTable;
