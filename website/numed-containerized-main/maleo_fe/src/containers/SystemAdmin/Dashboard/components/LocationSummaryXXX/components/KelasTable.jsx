import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Col,
} from 'reactstrap';
import ReactTableBase from '../../../../../../shared/components/table/ReactTableBase';

const KelasListTable = ({ listDataTable }) => {
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
            <h5 className="bold-text">LOCATION SUMMARY</h5>
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

KelasListTable.propTypes = {
  listDataTable: PropTypes.shape({
    tableHeaderData: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
    })),
    tableRowsData: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
};

export default KelasListTable;
