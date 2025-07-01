import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonToolbar,
  Card, CardBody, Col, Spinner,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactTableBase from '../../../../../../shared/components/table/ReactTableBase';

const VSRListTable = ({ listDataTable, isLoading }) => {
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
            <h5 className="bold-text">List of Vital Sign Result</h5>
            <ButtonToolbar className="products-list__btn-toolbar-top">
              <Link className="btn btn-primary products-list__btn-add" to="/input/vsr/manual">
                New Upload
              </Link>
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

VSRListTable.propTypes = {
  listDataTable: PropTypes.shape({
    tableHeaderData: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
    })),
    tableRowsData: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default VSRListTable;
