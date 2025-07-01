/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import
React,
{ useMemo } from 'react';
import { Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';

// const PhotoFormatter = (value) => (
//   <div className="products-list__img-wrap">
//     <img src={value} alt="" />
//   </div>
// );
const userDetail = (history, info) => {
  history.push({
    pathname: `/input/resultpcr/${info.id}/`,
    state: { data: info },
  });
};
// const DetailHandler = (history, info) => {
//   history.push({
//     pathname: `/course/detail/${info.id}/`,
//     state: { data: info },
//   });
// };

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
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Result',
        accessor: 'result',
      },
      // {
      //   Header: 'Photo',
      //   accessor: 'photo',
      //   disableGlobalFilter: true,
      //   disableSortBy: true,
      // },
      // {
      //   Header: 'Activity',
      //   accessor: 'activity',
      // },
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
        } else if (dataAPI[i].category === 'PCR') {
          data.push({
            id: dataAPI[i].id,
            number: `${i + 1}`,
            name: dataAPI[i].patient_detail.fullname,
            category: dataAPI[i].category,
            result: dataAPI[i].result_1_pcr,
            status: [
              // eslint-disable-next-line no-loop-func
              // eslint-disable-next-line max-len
              (<Button size="sm" color="success" onClick={() => userDetail(history, dataAPI[i])}>Detail</Button>),
              // (<Button size="sm" color="primary" onClick={() => DetailHandler(history, dataAPI[i])}>Detail</Button>),
            ],
          });
        } else {
          data.push({
            id: dataAPI[i].id,
            number: `${i + 1}`,
            name: dataAPI[i].patient_detail.fullname,
            category: dataAPI[i].category,
            result: dataAPI[i].result_swab,
            // photo: PhotoFormatter(`${dataAPI[i].image}`),
            // username: dataAPI[i].fullname,
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
