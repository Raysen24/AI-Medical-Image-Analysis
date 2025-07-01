/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import
React,
{ useMemo } from 'react';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

const userDetail = (history, info) => {
  history.push({
    pathname: `/dashboard/hospital-detail/${info.id}`,
    state: { data: info },
  });
};

const CreateDataOrderListTable = (dataAPI) => {
  // console.log('DATA ARI', dataAPI);
  const history = useHistory();
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'number',
        width: 20,
        disableSortBy: true,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        accessor: 'phone',
        Header: 'Phone',
        disableGlobalFilter: true,
        disableSortBy: true,
        width: 110,
      },
      {
        accessor: 'status',
        Header: 'Status',
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
            // photo: PhotoFormatter(`${dataAPI[i].image}`),
            name: dataAPI[i].name,
            address: dataAPI[i].address,
            // role: dataAPI[i].role,
            phone: dataAPI[i].phone,
            status: [
              // eslint-disable-next-line no-loop-func
              // eslint-disable-next-line max-len
              (<Button color="success" onClick={() => userDetail(history, dataAPI[i])}>Detail</Button>),
              // (<Button size="sm" color="primary" onClick={() => DetailHandler(history, dataAPI[i])}>Detail</Button>),
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
