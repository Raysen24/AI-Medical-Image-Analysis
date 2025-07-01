/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Col, ButtonToolbar, Button,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import ReactTableBase from '../../../../../../shared/components/table/ReactTableBase';

const MedicalRecord = (history, info) => {
  history.push({
    pathname: `/patient-data/new-medical-record/${info}`,
    state: { data: info },
  });
};

const ListMRPatientTable = ({ listDataTable }) => {
  const { t } = useTranslation('common');
  const tableConfig = {
    isEditable: false,
    isSortable: true,
    isResizable: false,
    withPagination: true,
    withSearchEngine: true,
    manualPageSize: [10, 20, 30, 40],
    placeholder: 'Search...',
  };
  const history = useHistory();
  const params = useParams();

  return (
    <Col md={12} lg={12}>
      <Card>
        <CardBody className="products-list">
          <div className="card__title">
            <h5 className="bold-text">{t('patient.medical_record.page_title')}</h5>
            <ButtonToolbar className="products-list__btn-toolbar-top">
              <Button size="sm" color="warning" onClick={() => MedicalRecord(history, params.id)}>
                {t('patient.medical_record.new')}
              </Button>
            </ButtonToolbar>
          </div>
          <ReactTableBase
            columns={listDataTable.tableHeaderData}
            data={listDataTable.tableRowsData}
            tableConfig={tableConfig}
          />
        </CardBody>
      </Card>
    </Col>
  );
};

ListMRPatientTable.propTypes = {
  listDataTable: PropTypes.shape({
    tableHeaderData: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
    })),
    tableRowsData: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
};

export default ListMRPatientTable;
