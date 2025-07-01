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
// const productDetailHandler = (history, info) => {
//   history.push({
//     pathname: `/course/report/${info.id}/`,
//     state: { data: info },
//   });
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
        Header: 'Date & Time',
        accessor: 'datetime',
      },
      {
        Header: 'Username',
        accessor: 'username',
      },
      // {
      //   Header: 'Role',
      //   accessor: 'role',
      //   // disableGlobalFilter: true,
      //   // disableSortBy: true,
      //   // width: 110,
      // },
      {
        accessor: 'address',
        Header: 'Address',
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
      for (let i = 0; i < 7; i += 1) {
        if (dataAPI.length === 0) {
          data.push({
            number: '-',
            name: '-',
          });
        } else {
          data.push({
            id: dataAPI[i].id,
            number: `${i + 1}`,
            // photo: PhotoFormatter(`${dataAPI[i].image}`),
            name: ['Maria', 'Bobby  ', 'Alexander'][Math.floor((Math.random() * 3))],
            // judul_course: dataAPI[i].judul,
            // hari_kelas: dataAPI[i].hari_kelas,
            // status: [
            //   // eslint-disable-next-line no-loop-func
            //   // eslint-disable-next-line max-len
            //   (<Button size="sm" color="success" onClick={() => productDetailHandler(history, dataAPI[i])}>Report</Button>),
            //   // (<Button size="sm" color="primary" onClick={() => DetailHandler(history, dataAPI[i])}>Detail</Button>),
            // ],
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
