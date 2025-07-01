/* eslint-disable no-unused-expressions */
/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import
// React,
{ useMemo } from 'react';
// import { Button } from 'reactstrap';
// import { useHistory } from 'react-router-dom';

// const PhotoFormatter = (value) => (
//   <div className="products-list__img-wrap">
//     <img src={value} alt="" />
//   </div>
// );
// const userDetail = (history, info) => {
//   console.log('aa', info);
//   {
//     if (info.type === 'CXR') {
//       history.push({
//         pathname: `/input/result/cxr/${info.id}/`,
//         state: { data: info },
//       });
//     } else if (info.type === 'CT-Scan') {
//       history.push({
//         pathname: `/input/result/ctscan/${info.id}/`,
//         state: { data: info },
//       });
//     } else if (info.type === 'PCR') {
//       history.push({
//         pathname: `/input/resultpcr/${info.id}/`,
//         state: { data: info },
//       });
//     } else {
//       history.push({
//         pathname: `/input/result/bloodtest/${info.id}/`,
//         state: { data: info },
//       });
//     }
//   }
// };
// const DetailHandler = (history, info) => {
//   history.push({
//     pathname: `/course/detail/${info.id}/`,
//     state: { data: info },
//   });
// };

const CreateDataOrderListTable = (dataAPI) => {
  // console.log('DATA', dataAPI);
  // const history = useHistory();
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'number',
        width: 20,
        disableGlobalFilter: true,
      },
      // {
      //   Header: 'Photo',
      //   accessor: 'photo',
      //   disableGlobalFilter: true,
      //   disableSortBy: true,
      // },
      {
        Header: 'Data & Time',
        accessor: 'datetime',
      },
      {
        Header: 'Activity',
        accessor: 'activity',
      },
      // {
      //   Header: 'Role',
      //   accessor: 'role',
      //   // disableGlobalFilter: true,
      //   // disableSortBy: true,
      //   // width: 110,
      // },
      // {
      //   accessor: 'phone',
      //   Header: 'Phone',
      //   disableGlobalFilter: true,
      //   disableSortBy: true,
      //   width: 110,
      // },
      // {
      //   accessor: 'status',
      //   Header: 'Action',
      //   disableGlobalFilter: true,
      //   disableSortBy: true,
      //   width: 110,
      // },
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
            datetime: dataAPI[i].created_at,
            activity: `You uploaded a ${dataAPI[i].type} image`,
            // role: dataAPI[i].role,
            // phone: dataAPI[i].phone,
            status: [
              // eslint-disable-next-line no-loop-func
              // eslint-disable-next-line max-len
              // (<Button size="sm" color="success" onClick={() => userDetail(history, dataAPI[i])}>Result</Button>),
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
