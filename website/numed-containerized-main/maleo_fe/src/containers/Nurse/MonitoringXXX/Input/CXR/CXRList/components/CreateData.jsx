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
    pathname: `/input/result/cxr/${info.id}`,
    state: { data: info },
  });
};

const CreateDataOrderListTable = (dataAPI) => {
  // console.log('DATA', dataAPI);
  const history = useHistory();
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'number',
        width: 20,
        disableGlobalFilter: true,
      },
      {
        Header: 'Patient',
        accessor: 'patient',
        disableGlobalFilter: true,
        disableSortBy: true,
        width: 110,
      },
      {
        Header: 'Date & Time',
        accessor: 'datetime',
      },
      {
        Header: 'Photo',
        accessor: 'photo',
        disableGlobalFilter: true,
        disableSortBy: true,
        width: 110,
      },
      {
        Header: 'Upload By',
        accessor: 'upload',
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
            datetime: dataAPI[i].created_at,
            photo: PhotoFormatter(`${dataAPI[i].image}`),
            upload: dataAPI[i].upload_by_detail.fullname,
            // role: dataAPI[i].role,
            // phone: dataAPI[i].phone,
            status: [
              // eslint-disable-next-line no-loop-func
              // eslint-disable-next-line max-len
              (<Button size="sm" color="success" onClick={() => userDetail(history, dataAPI[i])}>Detail</Button>),
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
