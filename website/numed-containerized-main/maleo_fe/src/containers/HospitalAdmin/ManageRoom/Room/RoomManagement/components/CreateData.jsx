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
    pathname: `/hospital/room-detail/${info.id}/`,
    state: { data: info },
  });
};

const CreateDataOrderListTable = (dataAPI) => {
  console.log('DATA room', dataAPI);
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
        Header: 'Number',
        accessor: 'room_number',
      },
      {
        Header: 'Active',
        accessor: 'active',
      },
      {
        Header: 'Building',
        accessor: 'building',
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
            name: dataAPI[i].room_name,
            room_number: `${dataAPI[i].room_number}`,
            active: `${dataAPI[i].is_active}`,
            building: dataAPI[i].building_detail.name,
            status: [
              // eslint-disable-next-line no-loop-func
              // eslint-disable-next-line max-len
              (<Button color="success" onClick={() => userDetail(history, dataAPI[i])}>Detail</Button>),
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
