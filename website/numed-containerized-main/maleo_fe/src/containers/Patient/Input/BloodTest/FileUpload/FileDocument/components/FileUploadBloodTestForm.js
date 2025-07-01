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
import { LOCALSTORAGE_USERDETAIL, LOCALSTORAGE_TOKEN } from '../../../../../../../utils/Types';
import { ACCOUNT_PATIENT, BLOODTEST_IMPORTBYNURSE_MEDICALRECORD, BLOODTEST_IMPORTBYPATIENT_MEDICALRECORD } from '../../../../../../../utils/EndPoints';
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
    // { id: 1, title: 'Hospital' },
    { id: 1, title: 'basofil' },
    { id: 2, title: 'cl' },
    { id: 3, title: 'creat' },
    { id: 4, title: 'eos' },
    { id: 5, title: 'eri' },
    { id: 6, title: 'gsdfull' },
    { id: 7, title: 'hb' },
    { id: 8, title: 'hct' },
    { id: 9, title: 'k' },
    { id: 10, title: 'leko' },
    { id: 11, title: 'limfosit' },
    { id: 12, title: 'mch' },
    { id: 13, title: 'mchc' },
    { id: 14, title: 'mcv' },
    { id: 15, title: 'monosit' },
    { id: 16, title: 'na' },
    { id: 17, title: 'neutb' },
    { id: 18, title: 'nlr1' },
    { id: 19, title: 'plt' },
    { id: 20, title: 'rdw' },
    { id: 21, title: 'segmen' },
    { id: 22, title: 'sgot' },
    { id: 23, title: 'sgpt' },
    { id: 24, title: 'ureum' },
    { id: 25, title: 'led' },
    { id: 26, title: 'bildirek' },
    { id: 27, title: 'bilindir' },
    { id: 28, title: 'biltot' },
    { id: 29, title: 'hco3_n' },
    { id: 30, title: 'o2s_n' },
    { id: 31, title: 'pco2_n' },
    { id: 32, title: 'ph_nu' },
    { id: 33, title: 'po2_n' },
    { id: 34, title: 'tco2_n' },
    { id: 35, title: 'ptinr' },
    { id: 36, title: 'bjurin' },
    { id: 37, title: 'phurin' },
    { id: 38, title: 'choles' },
    { id: 39, title: 'gdpfull' },
    { id: 40, title: 'gdppfull' },
    { id: 41, title: 'hdlcho' },
    { id: 42, title: 'ldlcho' },
    { id: 43, title: 'trigl' },
    { id: 44, title: 'ua' },
    { id: 45, title: 'tshsnew' },
    { id: 46, title: 'albcp' },
    { id: 47, title: 'tp' },
    { id: 48, title: 't4' },
    { id: 49, title: 'mg' },
    { id: 50, title: 'caltot' },
    { id: 51, title: 'glurapid' },
    { id: 52, title: 'hdld' },
    { id: 53, title: 'alp' },
    { id: 54, title: 'ggt' },
    { id: 55, title: 'glob' },
    { id: 56, title: 'ldh' },
    { id: 57, title: 'ft4' },
    { id: 58, title: 'lakt_dr' },
    { id: 59, title: 'acp001' },
    { id: 60, title: 'acp002' },
    { id: 61, title: 'acp009' },
    { id: 62, title: 'cglu' },
    { id: 63, title: 'cldh' },
    { id: 64, title: 'cprot' },
    { id: 65, title: 'sglu' },
    { id: 66, title: 'sldh' },
    { id: 67, title: 'sprot' },
    { id: 68, title: 'aca001' },
    { id: 69, title: 'aca002' },
    { id: 70, title: 'aca009' },
    { id: 71, title: 'cglua' },
    { id: 72, title: 'cldha' },
    { id: 73, title: 'cprota' },
    { id: 74, title: 'sglua' },
    { id: 75, title: 'sldha' },
    { id: 76, title: 'sprota' },
    { id: 77, title: 'tgl_lahir' },
  ];
  return (
    <Col md={12} lg={12}>
      <Card className="card--not-full-height">
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">Blood Test File Upload Form</h5>
            <h5 className="subhead">For files upload</h5>
            <ButtonToolbar className="products-list__btn-toolbar-top">
              <a className="btn btn-primary products-list__btn-add" href="SCHEMA://SERVER_ADDRESS/static/templateBloodtest/patient.xlsx">
                Download Format
              </a>
            </ButtonToolbar>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form__form-group">
              <span className="form__form-group-label">Your Blood Test Data (.XLSX)</span>
              <div className="form__form-group-field">
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
                        <td>{item.basofil}</td>
                        <td>{item.cl}</td>
                        <td>{item.creat}</td>
                        <td>{item.eos}</td>
                        <td>{item.eri}</td>
                        <td>{item.gsdfull}</td>
                        <td>{item.hb}</td>
                        <td>{item.hct}</td>
                        <td>{item.k}</td>
                        <td>{item.leko}</td>
                        <td>{item.limfosit}</td>
                        <td>{item.mch}</td>
                        <td>{item.mchc}</td>
                        <td>{item.mcv}</td>
                        <td>{item.monosit}</td>
                        <td>{item.na}</td>
                        <td>{item.neutb}</td>
                        <td>{item.nlr1}</td>
                        <td>{item.plt}</td>
                        <td>{item.rdw}</td>
                        <td>{item.segmen}</td>
                        <td>{item.sgot}</td>
                        <td>{item.sgpt}</td>
                        <td>{item.ureum}</td>
                        <td>{item.led}</td>
                        <td>{item.bildirek}</td>
                        <td>{item.bilindir}</td>
                        <td>{item.biltot}</td>
                        <td>{item.hco3_n}</td>
                        <td>{item.o2s_n}</td>
                        <td>{item.pco2_n}</td>
                        <td>{item.ph_nu}</td>
                        <td>{item.po2_n}</td>
                        <td>{item.tco2_n}</td>
                        <td>{item.ptinr}</td>
                        <td>{item.bjurin}</td>
                        <td>{item.phurin}</td>
                        <td>{item.choles}</td>
                        <td>{item.gdpfull}</td>
                        <td>{item.gdppfull}</td>
                        <td>{item.hdlcho}</td>
                        <td>{item.ldlcho}</td>
                        <td>{item.trigl}</td>
                        <td>{item.ua}</td>
                        <td>{item.tshsnew}</td>
                        <td>{item.albcp}</td>
                        <td>{item.tp}</td>
                        <td>{item.t4}</td>
                        <td>{item.mg}</td>
                        <td>{item.caltot}</td>
                        <td>{item.glurapid}</td>
                        <td>{item.hdld}</td>
                        <td>{item.alp}</td>
                        <td>{item.ggt}</td>
                        <td>{item.glob}</td>
                        <td>{item.ldh}</td>
                        <td>{item.ft4}</td>
                        <td>{item.lakt_dr}</td>
                        <td>{item.acp001}</td>
                        <td>{item.acp002}</td>
                        <td>{item.acp009}</td>
                        <td>{item.cglu}</td>
                        <td>{item.cldh}</td>
                        <td>{item.cprot}</td>
                        <td>{item.sglu}</td>
                        <td>{item.sldh}</td>
                        <td>{item.sprot}</td>
                        <td>{item.aca001}</td>
                        <td>{item.aca002}</td>
                        <td>{item.aca009}</td>
                        <td>{item.cglua}</td>
                        <td>{item.cldha}</td>
                        <td>{item.cprota}</td>
                        <td>{item.sglua}</td>
                        <td>{item.sldha}</td>
                        <td>{item.sprota}</td>
                        <td>{item.tgl_lahir}</td>
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
                <Button onClick={() => {
                  window.location.reload();
                }}
                >Cancel
                </Button>
              </div>
            ) : (
              <ButtonToolbar className="form__button-toolbar">
                <Button color="primary" type="submit" onClick={handleFile}>
                  View Details
                </Button>
              </ButtonToolbar>
            )}
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
