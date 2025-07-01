/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
// import axios from 'axios';
import { Container, Col, Row } from 'reactstrap';
import { useParams } from 'react-router-dom';
import KelasListTable from './components/KelasTable';
import CreateTableData from './components/CreateData';
// import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';

const KelasList = () => {
// const [studentByClass, setStudentByClass] = useState([]);
const listDataTable = CreateTableData();
// useEffect(() => {
//   const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
//   const options = {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Token ${token}`,
//     },
//   };
//   axios.get(`https://educourse.i-gen.co.id/api/userbyidkelas/${params.id}/`, options)
//     .then((res) => {
//       setStudentByClass(res.data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }, []);

  return (
    <Container>
      {/* <Row>
        <Col md={12}>
          <h3 className="page-title">Report Course Students</h3>
        </Col>
      </Row> */}
      <Row>
        <KelasListTable listDataTable={listDataTable} />
      </Row>
    </Container>
  );
  };
export default KelasList;
