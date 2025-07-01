/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import
React,
{ useMemo } from 'react';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

const PhotoFormatter = (value) => (
  <div className="products-list__img-wrap">
    <img src={value} alt="" />
  </div>
);
const userDetail = (history, info) => {
  history.push({
    pathname: `/input/result/ctscan/${info.id}`,
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
        Header: 'Patient',
        accessor: 'patient',
        disableSortBy: true,
        width: 110,
      },
      {
        Header: 'Date & Time',
        accessor: 'datetime',
      },
      {
        Header: 'MRDI',
        accessor: 'mrid',
      },
      {
        Header: 'Photo',
        accessor: 'photo',
        disableGlobalFilter: true,
        disableSortBy: true,
      },
      {
        Header: 'Upload By',
        accessor: 'upload',
        disableSortBy: true,
        width: 110,
      },
      {
        Header: 'Hospital',
        accessor: 'hospital',
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
            patient: dataAPI[i].patient_detail.fullname,
            photo: PhotoFormatter(`${dataAPI[i].image}`),
            datetime: dataAPI[i].created_at,
            mrid: dataAPI[i].patient_detail.mr_id_patient,
            upload: dataAPI[i].upload_by_detail.fullname,
            hospital: `${dataAPI[i].patient_detail.hospital_list[0].name}`,
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
