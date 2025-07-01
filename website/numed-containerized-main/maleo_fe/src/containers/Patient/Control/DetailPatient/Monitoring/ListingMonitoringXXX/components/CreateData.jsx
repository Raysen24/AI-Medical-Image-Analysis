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
const manageHandler = (history, info) => {
  history.push({
    pathname: `/patient-data/detail-monitoring/${info.id}`,
    state: { data: info },
  });
};
// const monitoringHandler = (history, info) => {
//   history.push({
//     pathname: `/nurse/input/monitoring/${info.id}/`,
//     state: { data: info },
//   });
// };

const CreateDataOrderListTable = (dataAPI) => {
  // console.log('DATA', dataAPI);
  const history = useHistory();
  const columns = useMemo(
    () => [
      {
        Header: 'No',
        accessor: 'number',
        width: 20,
        disableGlobalFilter: true,
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Oxygen Aid',
        accessor: 'oxygen',
      },
      {
        Header: 'Fall Score',
        accessor: 'fallscore',
      },
      {
        Header: 'Doctor Decision',
        accessor: 'decision',
      },
      {
        Header: 'EWS Score',
        accessor: 'ewsscore',
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
            // photo: PhotoFormatter(`${dataAPI[i].image}`),
            date: dataAPI[i].created_at,
            oxygen: dataAPI[i].oxygen_aid,
            fallscore: `${dataAPI[i].fall_score}`,
            decision: dataAPI[i].decision,
            ewsscore: `${dataAPI[i].ews_score}`,
            status: [
              // eslint-disable-next-line no-loop-func
              // eslint-disable-next-line max-len
              (<Button size="sm" color="primary" onClick={() => manageHandler(history, dataAPI[i])}>Detail</Button>),
              // (<Button size="sm" color="primary" onClick={() => monitoringHandler(history, dataAPI[i])}>Visitation</Button>),
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
