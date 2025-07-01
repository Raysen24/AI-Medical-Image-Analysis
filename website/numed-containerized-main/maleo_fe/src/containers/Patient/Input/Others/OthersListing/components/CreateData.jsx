/* eslint-disable react/react-in-jsx-scope */
import { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'reactstrap';

const DetailOthers = (history, info) => {
  history.push({
    pathname: `/patient-data/input/other/${info.id}`,
    state: { data: info },
  });
};

const CreateDataOrderListTable = (dataAPI) => {
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
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'MRID',
        accessor: 'mrid',
      },
      {
        Header: 'Upload By',
        accessor: 'uploadby',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Notes',
        accessor: 'note',
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
            date: dataAPI[i].created_at,
            mrid: dataAPI[i].patient_detail.mr_id_patient,
            name: dataAPI[i].patient_detail.fullname,
            uploadby: dataAPI[i].upload_by_detail.fullname,
            note: dataAPI[i].note,
            status: [
              // eslint-disable-next-line no-loop-func
              // eslint-disable-next-line max-len
              (<Button color="success" onClick={() => DetailOthers(history, dataAPI[i])}>Detail</Button>),
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
