/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import { useMemo } from 'react';

const CreateDataOrderListTable = (dataAPI) => {
  const columns = useMemo(
    () => [
      {
        Header: 'No',
        accessor: 'number',
        width: 20,
        disableSortBy: true,
      },
      {
        Header: 'Date & Time',
        accessor: 'datetime',
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
        Header: 'Hospital',
        accessor: 'hospital',
      },
      {
        Header: 'Activity',
        accessor: 'activity',
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
        name: '-',
      });
    } else {
      for (let i = 0; i < dataAPI.length; i += 1) {
        if (dataAPI.length === 0) {
          data.push({
            number: '-',
            name: '-',
          });
        } else {
          data.push({
            id: dataAPI[i].id,
            number: `${i + 1}`,
            datetime: dataAPI[i].created_at,
            username: `${dataAPI[i].patient_id ? dataAPI[i].patient_detail.fullname : '-'}`,
            role: `${dataAPI[i].patient_id ? dataAPI[i].patient_detail.role : '-'}`,
            hospital: `${dataAPI[i].patient_id ? dataAPI[i].patient_detail.hospital_list[0].name : '-'}`,
            activity: dataAPI[i].notes,
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
