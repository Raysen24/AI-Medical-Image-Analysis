/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import React, { useMemo } from 'react';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

const DetailHandler = (history, info) => {
  history.push({
    pathname: `/patient-data/detail-medical-record/${info.id}`,
    state: { data: info },
  });
};

const CreateDataOrderListTable = (dataAPI) => {
  const history = useHistory();
  const columns = useMemo(
    () => [
      {
        Header: 'No',
        accessor: 'number',
        width: 20,
        disableSortBy: true,
      },
      {
        Header: 'Created At',
        accessor: 'created_at',
      },
      {
        Header: 'Patient Name',
        accessor: 'patient_name',
      },
      {
        Header: 'Patient Status',
        accessor: 'patient_status',
      },
      {
        accessor: 'status',
        Header: 'Action',
        disableGlobalFilter: true,
        disableSortBy: true,
        width: 110,
      },
    ], [],
  );

  const data = [];
  const rows = () => {
    if (!dataAPI) {
      data.push({
        number: '-',
        username: '-',
      });
    } else {
      for (let i = 0; i < dataAPI.length; i += 1) {
        if (dataAPI.length === 0) {
          data.push({
            number: '-',
            username: '-',
          });
        } else {
          data.push({
            id: dataAPI[i].id,
            number: `${i + 1}`,
            created_at: dataAPI[i].created_at,
            patient_name: dataAPI[i].patient_detail.fullname,
            patient_status: dataAPI[i].patient_status,
            status: [
              // eslint-disable-next-line no-loop-func
              // eslint-disable-next-line max-len
              (<Button color="primary" onClick={() => DetailHandler(history, dataAPI[i])}>Detail</Button>),
            ],
          });
        }
      }
    }
  };

  rows();
  const partnerListTableData = { tableHeaderData: columns, tableRowsData: data };
  return partnerListTableData;
};

export default CreateDataOrderListTable;
