/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import React, { useMemo } from 'react';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

const userDetail = (history, info) => {
  history.push({
    pathname: `/dashboard/user-detail/${info.id}`,
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
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        disableSortBy: true,
        width: 110,
      },
      {
        Header: 'Hospital',
        accessor: 'hospital',
      },
      {
        Header: 'Status',
        accessor: 'status',
        disableGlobalFilter: true,
        disableSortBy: true,
        width: 110,
      },
    ],
    [],
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
            email: dataAPI[i].email,
            username: dataAPI[i].fullname,
            role: dataAPI[i].role,
            phone: dataAPI[i].phone,
            hospital: `${dataAPI[i].hospital_list[0] ? dataAPI[i].hospital_list[0].name : '-'}`,
            status: [
              // eslint-disable-next-line no-loop-func
              // eslint-disable-next-line max-len
              <Button color="primary" onClick={() => userDetail(history, dataAPI[i])}>
                Detail
              </Button>,
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
