import { useMemo } from 'react';

const CreateDataOrderListTable = (dataAPI) => {
  // console.log('DATA', dataAPI);
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'number',
        width: 20,
        disableSortBy: true,
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'MR ID',
        accessor: 'mrid',
      },
      {
        Header: 'Upload By',
        accessor: 'uploadby',
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Result',
        accessor: 'result',
      },
      {
        Header: 'CT-Value',
        accessor: 'ctvalue',
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
            date: dataAPI[i].date,
            mrid: dataAPI[i].patient_detail.mr_id_patient,
            name: dataAPI[i].patient_detail.fullname,
            uploadby: dataAPI[i].upload_by_detail.fullname,
            category: dataAPI[i].category,
            result: dataAPI[i].result,
            ctvalue: dataAPI[i].ct_value,
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
