/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Button,
} from 'reactstrap';
import XLSX from 'xlsx';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
// import BloodtestSampelPatient from '../../../../../../shared/file/Bloodtest-sample-patient.xlsx';
// import renderFileInputField from '../../../../../../shared/components/form/FileInput';
import { LOCALSTORAGE_USERDETAIL, LOCALSTORAGE_TOKEN } from '../../../../../../../../utils/Types';
import { ACCOUNT_PATIENT, BLOODTEST_IMPORTBYNURSE_MEDICALRECORD, BLOODTEST_IMPORTBYPATIENT_MEDICALRECORD } from '../../../../../../../../utils/EndPoints';
// import renderSelectField from '../../../../../../shared/components/form/Select';

const FileUploadBloodTestForm = ({ handleSubmit }) => {
  const history = useHistory();
  const [cols, setCols] = useState(null);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);

  const makeCols = (refstr) => {
    const o = [];
    const C = XLSX.utils.decode_range(refstr).e.c + 1;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < C; ++i) o[i] = { name: XLSX.utils.encode_col(i), key: i };
    return o;
  };

  const handleChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) setFile(files[0]);
  };
  const handleFile = () => {
    if (!file) {
      // eslint-disable-next-line no-alert
      alert('Anda Harus memasukan file terlebih dahulu');
      return;
    }
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const resp = XLSX.utils.sheet_to_json(ws, { defval: '' });
      // eslint-disable-next-line no-console
      console.log('resp', resp);
      /* Update state */
      setData(resp);
      setCols(makeCols(ws['!ref']));
      // eslint-disable-next-line no-console
      console.log(cols);
      // eslint-disable-next-line no-console
      console.log('DATA', JSON.stringify(resp));
    };

    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const [idUser, setidUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  // const [userSex, setUserSex] = useState(null);
  console.log(idUser, userRole);

  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    // console.log('user nih', userDetail);
    setidUser(userDetail.id);
    setUserRole(userDetail.role);
  });

  // const [patient, setPatient] = useState([]);
  // const [selectedStudent, setSelectedStudent] = useState(false);

  // const patientList = patient
  //   ? patient.map((e) => ({
  //     value: `${e.id}`, label: `${e.fullname}`,
  //   })) : [];

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios
      .get(ACCOUNT_PATIENT, options)
      .then(() => {
        // setPatient(res.data);
        // setUserSex(userDetail.sex);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const header = [
    { id: 1, title: 'No' },
    userRole === 'Nurse' && { id: 1, title: 'Email' },
    { id: 2, title: 'Age' },
    { id: 3, title: 'ca' },
    { id: 4, title: 'alp' },
    { id: 5, title: 'ast' },
    { id: 6, title: 'alt' },
    { id: 7, title: 'ldh' },
    { id: 8, title: 'crp' },
    { id: 9, title: 'urea' },
    { id: 10, title: 'wbc' },
    { id: 11, title: 'hct' },
    { id: 12, title: 'plt1' },
    { id: 13, title: 'eo' },
    { id: 14, title: 'ne' },
    { id: 15, title: 'ck' },
    { id: 16, title: 'crea' },
    { id: 17, title: 'ggt' },
    { id: 18, title: 'glu' },
    { id: 19, title: 'k' },
    { id: 20, title: 'na' },
    { id: 21, title: 'rbc' },
    { id: 22, title: 'hgb' },
    { id: 23, title: 'mcv' },
    { id: 24, title: 'mch' },
    { id: 25, title: 'mchc' },
    { id: 26, title: 'ly' },
    { id: 27, title: 'mo' },
    { id: 28, title: 'ba' },
    { id: 29, title: 'net' },
    { id: 30, title: 'lyt' },
    { id: 31, title: 'mot' },
    { id: 32, title: 'eot' },
    { id: 33, title: 'bat' },
    { id: 34, title: 'suspect' },
  ];
  return (
    <Col md={12} lg={12}>
      <Card className="card--not-full-height">
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">Blood Test File Upload Form</h5>
            <h5 className="subhead">For files upload</h5>
            <ButtonToolbar className="products-list__btn-toolbar-top">
              <a className="btn btn-primary products-list__btn-add" href="../../../../../../shared/file/Bloodtest-sample-patient.xlsx">
                Download Format
              </a>
            </ButtonToolbar>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            {/* {
              userRole === 'Patient'
                ? (
                  <input
                    name="patient_id"
                    component="input"
                    type="hidden"
                    value={idUser}
                  />
                ) : (
                  <div className="form__form-group">
                    <span className="form__form-group-label">Patient Name</span>
                    <div className="form__form-group-field">
                      <Field
                        name="patient_id"
                        component={renderSelectField}
                        type="text"
                        placeholder="Please select an option"
                        options={patientList || [
                          { value: 'one', label: 'Not Found' },
                        ]}
                        required
                      />
                    </div>
                  </div>
                )
            } */}
            {/* <input
              name="upload_by"
              component="input"
              type="hidden"
              value={idUser}
            /> */}
            <div className="form__form-group">
              <span className="form__form-group-label">Your Blood Test Data (CSV/Excel)</span>
              <div className="form__form-group-field">
                {/* <Field
                  name="image"
                  component={renderFileInputField}
                  required
                /> */}
                {/* <ButtonToolbar className="form__button-toolbar">
                  <Button />
                  <Button
                    color="primary"
                    type="submit"
                    onClick={handleFile}
                  >
                    Submit
                  </Button>
                </ButtonToolbar> */}
                <input type="file" onChange={handleChange} style={{ padding: '10px' }} />
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    {header.map((item) => (
                      <th key={item.id}>{item.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => {
                    console.log('item');
                    return (
                      <tr key={item.emailPatient}>
                        <td>{item.no}</td>
                        {userRole === 'Nurse' ? <td>{item.emailPatient}</td> : ''}
                        <td>{item.age}</td>
                        <td>{item.ca}</td>
                        <td>{item.alp}</td>
                        <td>{item.ast}</td>
                        <td>{item.alt}</td>
                        <td>{item.ldh}</td>
                        <td>{item.crp}</td>
                        <td>{item.urea}</td>
                        <td>{item.wbc}</td>
                        <td>{item.hct}</td>
                        <td>{item.plt1}</td>
                        <td>{item.eo}</td>
                        <td>{item.ne}</td>
                        <td>{item.ck}</td>
                        <td>{item.crea}</td>
                        <td>{item.ggt}</td>
                        <td>{item.glu}</td>
                        <td>{item.k}</td>
                        <td>{item.na}</td>
                        <td>{item.rbc}</td>
                        <td>{item.hgb}</td>
                        <td>{item.mcv}</td>
                        <td>{item.mch}</td>
                        <td>{item.mchc}</td>
                        <td>{item.ly}</td>
                        <td>{item.mo}</td>
                        <td>{item.ba}</td>
                        <td>{item.net}</td>
                        <td>{item.lyt}</td>
                        <td>{item.mot}</td>
                        <td>{item.eot}</td>
                        <td>{item.bat}</td>
                        <td>{item.suspect}</td>
                        {/* <td><Badge color={item.status}>{item.badge}</Badge></td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {data.length > 0 ? (
              <div className="mt-4">
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
                    const options = {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                      },
                    };
                    axios
                      .post(userRole === 'Patient' ? BLOODTEST_IMPORTBYPATIENT_MEDICALRECORD : BLOODTEST_IMPORTBYNURSE_MEDICALRECORD, data, options)
                      .then(() => {
                        history.push({
                          pathname: '/patient-data/input/bloodtest',
                          // state: { data: listingAttendance },
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  Upload Data
                </button>
              </div>
            ) : (
              <ButtonToolbar className="form__button-toolbar">
                <Button color="primary" type="submit" onClick={handleFile}>
                  View Details
                </Button>
              </ButtonToolbar>
            )}
            {/* <ButtonToolbar className="form__button-toolbar">
              <Button
                color="primary"
                type="submit"
                // disabled={!selectedStudent}
              >
                Submit
              </Button>
            </ButtonToolbar> */}
          </form>
        </CardBody>
      </Card>
    </Col>
  );
};

FileUploadBloodTestForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'file_upload_default', // a unique identifier for this form
})(FileUploadBloodTestForm);
