/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import React, { useMemo } from 'react';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

const DetailHandler = (history, info) => {
  history.push({
    pathname: `/patient-data/medical-record/${info.id}`,
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
        Header: 'MRID',
        accessor: 'mrid',
      },
      {
        Header: 'Patient Name',
        accessor: 'name',
      },
      {
        Header: 'Date of Birth',
        accessor: 'dob',
      },
      {
        Header: 'Email',
        accessor: 'email',
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
            mrid: `${dataAPI[i].mr_id_patient}`,
            name: dataAPI[i].fullname,
            dob: dataAPI[i].dob,
            email: dataAPI[i].email,
            status: [
              // eslint-disable-next-line no-loop-func
              // eslint-disable-next-line max-len
              (<Button color="success" onClick={() => DetailHandler(history, dataAPI[i])}>Detail</Button>),
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
