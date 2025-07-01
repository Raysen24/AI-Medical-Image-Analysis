import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, Col, ButtonToolbar, Button, Spinner,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import ReactTableBase from '../../../../../../../shared/components/table/ReactTableBase';

const userDetail = (history, info) => {
  history.push({
    pathname: `/patient-data/pcr/${info.id}`,
    state: { data: info },
  });
};

const PCRListTable = ({ listDataTable, isLoading }) => {
  const history = useHistory();
  const tableConfig = {
    isEditable: false,
    isSortable: true,
    isResizable: false,
    withPagination: true,
    withSearchEngine: true,
    manualPageSize: [10, 20, 30, 40],
    placeholder: 'Search...',
  };
  const { location } = history;
  const { state } = location;
  const { data } = state;
  return (
    <Col md={12} lg={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">List of PCR and Antigen Swab Test Result</h5>
            <ButtonToolbar className="products-list__btn-toolbar-top">
              <Button size="sm" color="primary" onClick={() => userDetail(history, data)}>
                New Upload
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

PCRListTable.propTypes = {
  listDataTable: PropTypes.shape({
    tableHeaderData: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
    })),
    tableRowsData: PropTypes.arrayOf(PropTypes.shape()),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default PCRListTable;
