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
        Header: 'MR ID',
        accessor: 'mrid',
        disableSortBy: true,
        width: 110,
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
            mrid: dataAPI[i].mr_id_patient,
            name: dataAPI[i].fullname,
            dob: dataAPI[i].dob,
            email: dataAPI[i].email,
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
