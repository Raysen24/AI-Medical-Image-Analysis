/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import { useMemo } from 'react';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

const userDetail = (history, info) => {
  history.push({
    pathname: `/input/result/vsr/${info.id}`,
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
        Header: 'Date & Time',
        accessor: 'datetime',
        disableSortBy: true,
      },
      {
        Header: 'MRID',
        accessor: 'mrid',
      },
      {
        Header: 'Patient',
        accessor: 'patient',
        disableSortBy: true,
      },
      {
        Header: 'Blood Pressure',
        accessor: 'blood_pressure',
        disableSortBy: true,
      },
      {
        Header: 'Heart Rate',
        accessor: 'heart_rate',
        disableSortBy: true,
      },
      {
        accessor: 'respirotary_rate',
        Header: 'Respirotary Rate',
        disableGlobalFilter: true,
        disableSortBy: true,
        width: 110,
      },
      {
        Header: 'Saturate',
        accessor: 'saturate',
        disableGlobalFilter: true,
        disableSortBy: true,
        width: 110,
      },
      {
        accessor: 'temperature',
        Header: 'Temperature',
        disableGlobalFilter: true,
        disableSortBy: true,
        width: 110,
      },
      {
        Header: 'EWS',
        accessor: 'ews',
        disableGlobalFilter: true,
        disableSortBy: true,
        width: 110,
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
            datetime: dataAPI[i].created_at,
            mrid: dataAPI[i].patient_detail.mr_id_patient,
            patient: dataAPI[i].patient_detail.fullname,
            blood_pressure: `${(dataAPI[i].blood_pressure).toFixed(3)}`,
            heart_rate: `${(dataAPI[i].heart_rate).toFixed(3)}`,
            respirotary_rate: `${(dataAPI[i].respirotary_rate.toFixed(3))}`,
            saturate: `${(dataAPI[i].saturate).toFixed(3)}`,
            temperature: `${(dataAPI[i].temperature).toFixed(3)}`,
            ews: `${dataAPI[i].ews_score}`,
            status: [
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
