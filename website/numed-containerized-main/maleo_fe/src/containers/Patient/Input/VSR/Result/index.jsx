/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable no-mixed-operators */
/* eslint-disable no-plusplus */
/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable no-console */
import React, { useEffect, useState, useRef } from 'react';
import {
  Col, Container, Row, Card, CardBody, Button, ButtonToolbar, Nav, NavItem, NavLink, TabContent, TabPane, Modal, ModalHeader, ModalBody,
} from 'reactstrap';
import { useHistory, Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import moment from 'moment';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line, Chart } from 'react-chartjs-2';
import axios from 'axios';
import { PieChart, ResponsiveContainer } from 'recharts';
import classnames from 'classnames';
import VSRResultBloodPressure from './components/VSRResultBloodPressure';
import VSRResultHeartRate from './components/VSRResultHeartRate';
import VSRResultRespiratoryRate from './components/VSRResultRespiratoryRate';
import VSRResultSaturation from './components/VSRResultSaturation';
import VSRResultTemperature from './components/VSRResultTemperature';
import {
  SETTING_BYVITALSIGN, SYNCHRONIZE_URL, VITAL_SIGN, AWS_VITAL_SIGN,
} from '../../../../../utils/EndPoints';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import Ava1 from '../../../../../shared/img/assets/oxygen_aid.png';
import renderSelectField from '../../../../../shared/components/form/Select';

Chart.register(zoomPlugin);

const VSRResult = () => {
  const chartRef = useRef(null);
  const resetZoom = () => {
    chartRef.current.resetZoom();
  };
  const history = useHistory();
  // const [cxrRecord, setcxrRecord] = useState([]);
  const [loadingNumed, setLoadingApi] = useState(false);
  // const [standardBloodPressure, setStandardBloodPressure] = useState(0);
  const [standardO2sturation, setStandardO2sturation] = useState([]);
  // const [standardHeartRate, setStandardHeartRate] = useState(0);
  const [standardRespiratoryRate, setStandardRespiratoryRate] = useState(0);
  const [standardTemperature, setStandardTemperature] = useState(0);

  // data api numed
  const [o2Time, setO2Time] = useState([]);
  const [o2Data, setO2Data] = useState([]);
  const [BloodTime, setBloodTime] = useState([]);
  const [BloodData, setBloodData] = useState([]);
  const [heartTime, setHeartTime] = useState([]);
  const [heartData, setHeartData] = useState([]);
  console.log(loadingNumed, BloodTime, BloodData, heartData, heartTime);
  const [RespiratoryTime, setRespiratoryTime] = useState([]);
  const [RespiratoryData, setRespiratoryData] = useState([]);
  const [TemperatureTime, setTemperatureTime] = useState([]);
  const [TemperatureData, setTemperatureData] = useState([]);

  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const [modal, setModal] = useState(false);
  const toggleOxy = () => {
    setModal(!modal);
  };
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [vsr, setVSR] = useState([]);
  const [vsrGraph, setVSRGraph] = useState([]);
  const [loading, setLoading] = useState(false);

  // get type
  const [typeData, setType] = useState('oxy');
  const [typeDataMeasurament, setTypeMeasurament] = useState([]);
  // get measurament id
  const [measuramentId, setMeasuramentId] = useState([]);
  const [idMeasurament, setIdMeasurament] = useState('');
  useEffect(() => {
    const tokenIot = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const optionsIot = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenIot}`,
        // Authorization: 'Bearer 28c0b2dd9d62ad9a9c32c5ad525516cb141421dd',
      },
    };
    // type

    axios.get('SCHEMA://SERVER_ADDRESS/api/v1/iot/data/type', optionsIot)
      .then((res) => {
        setTypeMeasurament(res.data.data);
      }).catch(() => {
        console.log('error');
      });
    // get measurament id
    axios.get(`SCHEMA://SERVER_ADDRESS/api/v1/iot/data/type/${typeData}/id`, optionsIot)
      .then((res) => {
        setMeasuramentId(res.data.data);
      }).catch(() => {
        console.log('error');
      });
    console.log(tokenIot);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(AWS_VITAL_SIGN, options)
      .then((res) => {
        setVSRGraph(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(VITAL_SIGN, options)
      .then((res) => {
        setVSR(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log('kl', vsr);
  // console.log('a2', standardO2sturation, o2Time, o2Data);

  // EWS

  const EWSData = loading && vsrGraph.length > 0
    ? vsrGraph.map((e) => e.ews_score) : [];
  const EWSLabel = loading && vsr.length > 0
    ? vsr.map((e) => e.created_at) : [];
  // console.log(vsr, EWSData);
  const measuramentTypeList = typeDataMeasurament
    ? typeDataMeasurament.map((e) => ({
      value: `${e}`, label: `${e}`,
    })) : [];
  const measuramentList = measuramentId
    ? measuramentId.map((e) => ({
      value: `${e}`, label: `${e}`,
    })) : [];

  console.log('STD', typeData, measuramentId);
  return (
    <Container className="dashboard">
      <Modal isOpen={modal} toggle={toggleOxy}>
        <ModalHeader className="mx-auto" oggle={toggleOxy}>Oxygen Aid</ModalHeader>
        <ModalBody>
          <form>
            <div>
              <div>
                <Field
                  name="oxy_aid"
                  component={renderSelectField}
                  type="text"
                  placeholder="Please select an option"
                  options={[
                    { value: 'Nasal Cannula', label: 'Nasal Cannula' },
                    { value: 'High Flow Nasal Cannula (HNFC)', label: 'High Flow Nasal Cannula (HNFC)' },
                    { value: 'Simple Mask', label: 'Simple Mask' },
                    { value: 'Partial Rebreathing Mask (RM)', label: 'Partial Rebreathing Mask (RM)' },
                    { value: 'NonRebreathing Mask (NRM)', label: 'NonRebreathing Mask (NRM)' },
                    { value: 'Ventilator', label: 'Ventilator' },
                    { value: 'None', label: 'None' },
                  ]}
                  onChange={(e) => {
                    console.log(e);
                    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
                    const options = {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                      },
                    };

                    const update = new FormData();
                    update.append('oxy_aid', e.value);
                    axios.patch(`${VITAL_SIGN}${vsr[0].id}/`, update, options)
                      .then(() => {
                        window.location.reload();
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                />
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
      <div className="card__title">
        <ButtonToolbar className="form__button-toolbar">
          <Button color="primary" onClick={history.goBack}>
            Back
          </Button>
        </ButtonToolbar>
        <ButtonToolbar className="products-list__btn-toolbar-top">
          <Link className="btn btn-primary products-list__btn-add" to="/patient-data/input/vsr">
            History
          </Link>
          <Link className="btn btn-primary products-list__btn-add" to="/input/vsr/manual">
            New Upload
          </Link>
          <Button
            color="success"
            size="sm"
            onClick={() => {
              const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
              const options = {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Token ${token}`,
                },
              };

              axios.get(`${SYNCHRONIZE_URL}?idpatient=${vsr[0].patient_detail.id}`, options)
                .then(() => {
                  window.location.reload();
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            synchronize
          </Button>
        </ButtonToolbar>
      </div>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody className="dashboard__title-card">
              <div>
                <div className="dashboard__title-card">
                  <div className="product-card__info">
                    <h1 className="product-card__title">
                      Here are your
                      <span className="red-text"> AI Based Vital Sign</span> results!
                    </h1>
                    <h3 className="page-subhead subhead">Uploaded on { vsr.length > 0 && vsr[0].created_at}
                    </h3>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={9}>
          <Row>
            <VSRResultBloodPressure />
            <VSRResultRespiratoryRate />
            <VSRResultSaturation />
            <VSRResultTemperature />
          </Row>
          <Row>
            <VSRResultHeartRate />
            <Col md={12} xl={4} lg={12} xs={12}>
              <Card>
                <CardBody className="dashboard__booking-card">
                  <div className="dashboard__booking-total-container">
                    <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                      <Button onClick={() => {
                        setModal(true);
                      }}
                      >{loading && vsr.length > 0 && vsr[0].oxy_aid}
                      </Button>
                    </h5>
                    <div className="dashboard__competitor-img">
                      <img src={Ava1} alt="" />
                    </div>
                  </div>
                  <h5 className="dashboard__booking-total-description">Oxygen Aid</h5>
                </CardBody>
              </Card>
            </Col>
            <Col md={12} xl={4} lg={12} xs={12}>
              <Card>
                <CardBody className="dashboard__booking-card">
                  <div className="dashboard__booking-total-container">
                    <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                      {/* {loadingNumed ? vsr[0].saturate : ''}% */}
                      <label className="toggle-btn customizer__toggle " htmlFor="consciousness_level">
                        <input
                          className="toggle-btn__input"
                          type="checkbox"
                          name="consciousness_level"
                          id="consciousness_level"
                          checked={vsr.length > 0 && vsr[0].consciousness_level}
                          onChange={(e) => {
                            const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
                            const options = {
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Token ${token}`,
                              },
                            };

                            const update = new FormData();
                            update.append('consciousness_level', e.target.checked);
                            axios.patch(`${VITAL_SIGN}${vsr[0].id}/`, update, options)
                              .then(() => {
                                window.location.reload();
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          }}
                        />
                        <span className="toggle-btn__input-label" />
                        {/* <span>Mode</span> */}
                      </label>
                    </h5>
                    <div className="dashboard__competitor-img">
                      <img src={Ava1} alt="" />
                    </div>
                  </div>
                  <h5 className="dashboard__booking-total-description">consciousness level</h5>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col lg={3}>
          <Col md={12} xl={12} lg={12} sm={12} xs={12}>
            <Card>
              <CardBody className="dashboard__health-chart-card">
                <div className="card__title">
                  <h5 className="bold-text card__title-center">Automatic EWS Score</h5>
                </div>
                <div className="dashboard__health-chart">
                  <ResponsiveContainer height={180}>
                    <PieChart>
                      {/* <Pie data={data} dataKey="value" /> */}
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="dashboard__health-chart-info">
                    {/* <HeartOutlineIcon style={{ fill: '#ff4861' }} /> */}
                    {
                      loading && vsr.length > 0 && vsr[0].ews_score >= 7
                        && (
                        <>
                          <p className="dashboard__health-chart-number" style={{ color: '#ff4861' }}>{loading && vsr.length > 0 && vsr[0].ews_score}</p>
                          <p className="dashboard__health-chart-units" style={{ color: '#ff4861' }}>High</p>
                        </>
                        )
                    }
                    {
                      loading && vsr.length > 0 && vsr[0].ews_score >= 5 && loading && vsr.length > 0 && vsr[0].ews_score <= 6
                        && (
                        <>
                          <p className="dashboard__health-chart-number" style={{ color: '#ffcc00' }}>{loading && vsr.length > 0 && vsr[0].ews_score}</p>
                          <p className="dashboard__health-chart-units" style={{ color: '#ffcc00' }}>Medium</p>
                        </>
                        )
                    }
                    {
                      loading && vsr.length > 0 && vsr[0].ews_score >= 1 && loading && vsr.length > 0 && vsr[0].ews_score <= 4
                        && (
                        <>
                          <p className="dashboard__health-chart-number" style={{ color: '#339900' }}>{loading && vsr.length > 0 && vsr[0].ews_score}</p>
                          <p className="dashboard__health-chart-units" style={{ color: '#339900' }}>Low</p>
                        </>
                        )
                    }
                  </div>
                </div>
                {/* <p className="dashboard__goal">Reference: 58-120</p> */}
              </CardBody>
            </Card>
          </Col>
        </Col>
      </Row>
      <Col md={12}>
        <Card>
          <CardBody className="dashboard__title-card">
            <div className="dashboard__title-card">
              <h3 className="product-card__title">Graph Result</h3>
              <Row>
                <div className="form__form-group">
                  <span className="form__form-group-label">Measurament Type</span>
                  <div className="form__form-group-field">
                    <Field
                      name="type_m"
                      component={renderSelectField}
                      type="text"
                      placeholder={typeData}
                      defaultValue={typeData}
                      options={measuramentTypeList || [
                        { value: 'one', label: 'Not Found' },
                      ]}
                      onChange={(e) => {
                        setType(e.value);
                      }}
                      required
                    />
                  </div>
                </div>
              </Row>
              <Row>
                <div className="form__form-group">
                  <span className="form__form-group-label">Measurament Id</span>
                  <div className="form__form-group-field">
                    <Field
                      name="id_m"
                      component={renderSelectField}
                      type="text"
                      placeholder="Please select an option"
                      options={measuramentList || [
                        { value: 'one', label: 'Not Found' },
                      ]}
                      onChange={(e) => {
                        setIdMeasurament(e.value);
                        // const tokenIot = localStorage.getItem(LOCALSTORAGE_TOKEN);
                        const optionsIot = {
                          headers: {
                            'Content-Type': 'application/json',
                            // Authorization: `Bearer ${tokenIot}`,
                            Authorization: 'Bearer 28c0b2dd9d62ad9a9c32c5ad525516cb141421dd',
                          },
                        };
                        axios.get(`SCHEMA://SERVER_ADDRESS/api/v1/iot/data/bulkdownload/${e.value}`, optionsIot)
                          .then((res) => {
                            console.log('res', res);
                            // setcxrRecord(res.data);
                            // respiratory
                            setRespiratoryTime(res.data.data.respiratory_rate.time);
                            setRespiratoryData(res.data.data.respiratory_rate.data);
                            // o2
                            setO2Time(res.data.data.O2_saturation.time);
                            setO2Data(res.data.data.O2_saturation.data);
                            // temperature
                            setTemperatureTime(res.data.data.temp.time);
                            setTemperatureData(res.data.data.temp.data);
                            setLoadingApi(true);

                            // get standard table
                            const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
                            const options = {
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Token ${token}`,
                              },
                            };
                            axios.get(SETTING_BYVITALSIGN, options)
                              .then((res1) => {
                                console.log('HIHI', res1);
                                // console.log(res.data.data.blood_pressure.time.length);
                                // standard blood pressure
                                // setLoadingApi(true);

                                // const dataBloodPressure = res1.data.filter((x) => x.key === 'Standard Blood Pressure');
                                // const a1 = [];
                                // if (dataBloodPressure.length > 0) {
                                //   for (let i = 0; i < res.data.data.blood_pressure.time.length; i++) {
                                //     a1.push((parseInt(dataBloodPressure[0].value)));
                                //   }
                                //   setStandardBloodPressure(a1);
                                // } else {
                                //   for (let i = 0; i < res.data.data.blood_pressure.time.length; i++) {
                                //     a1.push(0);
                                //   }
                                // }
                                // standard o2 saturation
                                const dataO2Saturation = res1.data.filter((x) => x.key === 'Standard O2 Saturation');
                                const a2 = [];
                                if (dataO2Saturation.length > 0) {
                                  for (let i = 0; i < res.data.data.O2_saturation.time.length; i++) {
                                    a2.push((parseInt(dataO2Saturation[0].value)));
                                  }
                                  setStandardO2sturation(a2);
                                } else {
                                  for (let i = 0; i < res.data.data.O2_saturation.time.length; i++) {
                                    a2.push(0);
                                  }
                                }
                                // standard heart rate
                                // const dataHeartRate = res1.data.filter((x) => x.key === 'Standard Heart Rate');
                                // const a3 = [];
                                // if (dataHeartRate.length > 0) {
                                //   for (let i = 0; i < res.data.data.heart_rate.time.length; i++) {
                                //     a3.push((parseInt(dataHeartRate[0].value)));
                                //   }
                                //   setStandardHeartRate(a3);
                                // } else {
                                //   for (let i = 0; i < res.data.data.heart_rate.time.length; i++) {
                                //     a3.push(0);
                                //   }
                                // }
                                // standard respiratory rate ari
                                const dataRespiratory = res1.data.filter((x) => x.key === 'Standard Respiratory Rate');
                                const a4 = [];
                                if (dataRespiratory.length > 0) {
                                  for (let i = 0; i < res.data.data.respiratory_rate.time.length; i++) {
                                    a4.push((parseInt(dataRespiratory[0].value)));
                                  }
                                  setStandardRespiratoryRate(a4);
                                } else {
                                  for (let i = 0; i < res.data.data.respiratory_rate.time.length; i++) {
                                    a4.push(0);
                                  }
                                }
                                // standard temperature
                                const dataTemperature = res1.data.filter((x) => x.key === 'Standard Temperature');
                                const a5 = [];
                                if (dataTemperature.length > 0) {
                                  for (let i = 0; i < res.data.data.temperature.time.length; i++) {
                                    a5.push((parseInt(dataTemperature[0].value)));
                                  }
                                  setStandardTemperature(a5);
                                } else {
                                  for (let i = 0; i < res.data.data.temperature.time.length; i++) {
                                    a5.push(0);
                                  }
                                }
                              })
                              .catch((err1) => {
                                console.log(err1);
                              });
                            // blood presure
                            setBloodTime(res.data.data.blood_pressure.time);
                            setBloodData(res.data.data.blood_pressure.data);
                            // heart rate
                            setHeartTime(res.data.data.heart_rate.time);
                            setHeartData(res.data.data.heart_rate.data);
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }}
                      required
                    />
                  </div>
                </div>
              </Row>
              <Row>
                <Col md={4} lg={4}>
                  <div className="d-flex">
                    <input
                      className="date-picker"
                      type="date"
                      name="start"
                      onChange={(e) => setEnd(e.target.value)}
                    />
                      &nbsp;&nbsp;
                    <input
                      className="date-picker"
                      type="date"
                      name="end"
                      onChange={(e) => setStart(e.target.value)}
                    />
                  </div>
                </Col>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => {
                    // const tokenIot = localStorage.getItem(LOCALSTORAGE_TOKEN);
                    const optionsIot = {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer 28c0b2dd9d62ad9a9c32c5ad525516cb141421dd',
                      },
                    };
                    axios.get(`SCHEMA://SERVER_ADDRESS/api/v1/iot/data/bulkdownload/${idMeasurament}`,
                      optionsIot)
                      .then((res) => {
                        // O2
                        const filterTimeO2 = [];
                        const timeFilteredO2 = [];
                        res.data.data.O2_saturation.time.filter((e, z) => {
                          console.log(e);
                          if (moment(e * 1000).format('DD-MM-YYYY') >= moment(start).format('DD-MM-YYYY') && moment(e * 1000).format('DD-MM-YYYY') <= moment(end).format('DD-MM-YYYY')) {
                            filterTimeO2.push(z);
                            // setFilter(filterTimeO2);
                            timeFilteredO2.push(e);
                          }
                        });
                        setO2Time(timeFilteredO2);
                        const dataFilteredO2 = [];
                        res.data.data.O2_saturation.data.filter((e, z) => {
                          // console.log('arsipapppp', e);
                          for (let t = 0; t <= filterTimeO2.length; t++) {
                            if (z === filterTimeO2[t]) {
                              dataFilteredO2.push(e);
                            }
                          }
                        });
                        setO2Data(dataFilteredO2);

                        // respiratory
                        const filterTimeRespiratory = [];
                        const timeFilteredRespiratory = [];
                        res.data.data.respirotary_rate.time.filter((e, z) => {
                          console.log(e);
                          if (moment(e * 1000).format('DD-MM-YYYY') >= moment(start).format('DD-MM-YYYY') && moment(e * 1000).format('DD-MM-YYYY') <= moment(end).format('DD-MM-YYYY')) {
                            filterTimeRespiratory.push(z);
                            timeFilteredRespiratory.push(e);
                          }
                        });
                        setRespiratoryTime(timeFilteredRespiratory);
                        const dataFilteredRespiratory = [];
                        res.data.data.respirotary_rate.data.filter((e, z) => {
                          for (let t = 0; t <= filterTimeRespiratory.length; t++) {
                            if (z === filterTimeRespiratory[t]) {
                              dataFilteredRespiratory.push(e);
                            }
                          }
                        });
                        setRespiratoryData(dataFilteredRespiratory);

                        // temperature
                        const filterTimeTemperature = [];
                        const timeFilteredTemperature = [];
                        res.data.data.temp.time.filter((e, z) => {
                          console.log(e);
                          if (moment(e * 1000).format('DD-MM-YYYY') >= moment(start).format('DD-MM-YYYY') && moment(e * 1000).format('DD-MM-YYYY') <= moment(end).format('DD-MM-YYYY')) {
                            filterTimeTemperature.push(z);
                            timeFilteredTemperature.push(e);
                          }
                        });
                        setTemperatureTime(timeFilteredTemperature);
                        const dataFilteredTemperature = [];
                        res.data.data.temp.data.filter((e, z) => {
                          for (let t = 0; t <= filterTimeTemperature.length; t++) {
                            if (z === filterTimeTemperature[t]) {
                              dataFilteredTemperature.push(e);
                            }
                          }
                        });
                        setTemperatureData(dataFilteredTemperature);
                        // setcxrRecord(res.data);
                        // heart rate
                        const filterTimeHeart = [];
                        const timeFilteredHeart = [];
                        res.data.data.heart_rate.time.filter((e, z) => {
                          console.log(e);
                          if (moment(e * 1000).format('DD-MM-YYYY') >= moment(start).format('DD-MM-YYYY') && moment(e * 1000).format('DD-MM-YYYY') <= moment(end).format('DD-MM-YYYY')) {
                            filterTimeHeart.push(z);
                            timeFilteredHeart.push(e);
                          }
                        });
                        setHeartTime(timeFilteredHeart);
                        const dataFilteredHeart = [];
                        res.data.data.heart_rate.data.filter((e, z) => {
                          for (let t = 0; t <= filterTimeHeart.length; t++) {
                            if (z === filterTimeHeart[t]) {
                              dataFilteredHeart.push(e);
                            }
                          }
                        });
                        setHeartData(dataFilteredHeart);
                        // BloodPresure
                        const filterTimeBlood = [];
                        const timeFilteredBlood = [];
                        res.data.data.blood_pressure.time.filter((e, z) => {
                          console.log(e);
                          if (moment(e * 1000).format('DD-MM-YYYY') >= moment(start).format('DD-MM-YYYY') && moment(e * 1000).format('DD-MM-YYYY') <= moment(end).format('DD-MM-YYYY')) {
                            filterTimeBlood.push(z);
                            // setFilter(filterTimeO2);
                            timeFilteredBlood.push(e);
                          }
                        });
                        setBloodTime(timeFilteredBlood);
                        const dataFilteredBlood = [];
                        res.data.data.blood_pressure.data.filter((e, z) => {
                          // console.log('arsipapppp', e);
                          for (let t = 0; t <= filterTimeBlood.length; t++) {
                            if (z === filterTimeBlood[t]) {
                              dataFilteredBlood.push(e);
                            }
                          }
                        });
                        setBloodData(dataFilteredBlood);
                        setLoadingApi(true);
                      }).catch((err) => {
                        console.log(err);
                      });
                  }}
                >Submit
                </Button>
              </Row>
            </div>
            <div className="tabs tabs--justify tabs--bordered-top">
              <div className="tabs__wrap">
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '1' })}
                      onClick={() => toggle('1')}
                    >
                      EWS
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '2' })}
                      onClick={() => toggle('2')}
                    >
                      02 Saturation (02)
                    </NavLink>
                  </NavItem>
                  {/* <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '3' })}
                      onClick={() => toggle('3')}
                    >
                      Blood Pressure (MmHg)
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '4' })}
                      onClick={() => toggle('4')}
                    >
                      Heart Rate (BPM)
                    </NavLink>
                  </NavItem> */}
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '3' })}
                      onClick={() => toggle('3')}
                    >
                      Respiratory Rate
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({ active: activeTab === '4' })}
                      onClick={() => toggle('4')}
                    >
                      Temperature (C)
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Row>
                      <Col md={12} xl={12} lg={12} sm={12} xs={12}>
                        <div className="card__title ">
                          <Button className="btn btn-warning products-list__btn-add" onClick={resetZoom}>Reset</Button>
                        </div>
                        <Card>
                          <CardBody>
                            <Line
                              ref={chartRef}
                              data={{
                                labels: EWSLabel,
                                datasets: [{
                                  label: 'ews',
                                  data: EWSData,
                                  fill: true,
                                  borderColor: '#2B7A0B',
                                  tension: 0.1,
                                }],
                              }}
                              options={{
                                plugins: {
                                  zoom: {
                                    zoom: {
                                      wheel: {
                                        enabled: true,
                                      },
                                      mode: 'x',
                                      speed: 100,
                                    },
                                    pan: {
                                      enabled: true,
                                      mode: 'x',
                                      speed: 100,
                                    },
                                  },
                                },
                                maintainAspectRatio: true,
                                responsive: true,
                                elements: {
                                  point: {
                                    radius: 1,
                                  },
                                  line: {
                                    borderWidth: 1.5,
                                  },
                                },
                                interaction: {
                                  mode: 'index',
                                  intersect: false,
                                },
                              }}
                            />
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col md={12} xl={12} lg={12} sm={12} xs={12}>
                        {/* <Button onClick={resetZoom}>reset</Button> */}
                        <div className="card__title ">
                          <Button className="btn btn-warning products-list__btn-add" onClick={resetZoom}>Reset</Button>
                        </div>
                        <Card>
                          <CardBody>
                            <Line
                              ref={chartRef}
                              data={{
                                labels: o2Time.map((e) => moment(e * 1000).format('DD MMM YYYY hh:mm')),
                                datasets: [{
                                  label: 'O2_saturation',
                                  data: o2Data,
                                  fill: false,
                                  borderColor: '#D61C4E',
                                  tension: 0.1,
                                },
                                {
                                  label: 'standard',
                                  data: standardO2sturation,
                                  fill: false,
                                  borderColor: '#F66B0E',
                                  tension: 0.1,
                                },
                                ],
                              }}
                              options={{
                                plugins: {
                                  zoom: {
                                    zoom: {
                                      wheel: {
                                        enabled: true,
                                      },
                                      mode: 'x',
                                      speed: 100,
                                    },
                                    pan: {
                                      enabled: true,
                                      mode: 'x',
                                      speed: 100,
                                    },
                                  },
                                },
                                maintainAspectRatio: true,
                                responsive: true,
                                elements: {
                                  point: {
                                    radius: 1,
                                  },
                                  line: {
                                    borderWidth: 1.5,
                                  },
                                },
                                interaction: {
                                  mode: 'index',
                                  intersect: false,
                                },
                                // scales: {
                                //   x: {
                                //     ticks: {
                                //       color: 'rgba( 0, 0, 1)',
                                //     },
                                //     grid: {
                                //       color: 'rgba(0, 0, 0, 1)',
                                //     },
                                //   },
                                //   y: {
                                //     min: 1,
                                //     max: 200,
                                //     type: 'logarithmic',
                                //     ticks: {
                                //       color: 'rgba(0, 0, 0, 1)',
                                //     },
                                //     grid: {
                                //       color: 'rgba(0, 0, 0, 1)',
                                //     },
                                //   },
                                // },
                              }}
                            />
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                  {/* <TabPane tabId="3">
                    <Row>
                      <Col md={12} xl={12} lg={12} sm={12} xs={12}>
                        <div className="card__title ">
                          <Button className="btn btn-warning products-list__btn-add" onClick={resetZoom}>Reset</Button>
                        </div>
                        <Card>
                          <CardBody>
                            <Line
                              ref={chartRef}
                              data={{
                                labels: loadingNumed && BloodTime.map((e) => moment(e * 1000).format('DD MMM YYYY hh:mm')),
                                datasets: [{
                                  label: 'blood_pressure',
                                  data: loadingNumed && BloodData,
                                  fill: false,
                                  borderColor: 'rgb(75, 192, 100)',
                                  tension: 0.1,
                                },
                                //  {
                                //   label: 'standard',
                                //   data: loadingNumed && standardBloodPressure,
                                //   fill: false,
                                //   borderColor: 'rgb(110, 0, 0)',
                                //   tension: 0.1,
                                // }
                                ],
                              }}
                              options={{
                                plugins: {
                                  zoom: {
                                    zoom: {
                                      wheel: {
                                        enabled: true, // SET SCROOL ZOOM TO TRUE
                                      },
                                      mode: 'xy',
                                      speed: 100,
                                    },
                                    pan: {
                                      enabled: true,
                                      mode: 'xy',
                                      speed: 100,
                                    },
                                  },
                                },
                                maintainAspectRatio: true,
                                responsive: true,
                                elements: {
                                  point: {
                                    radius: 1,
                                  },
                                  line: {
                                    borderWidth: 1.5,
                                  },
                                },
                                interaction: {
                                  mode: 'index',
                                  intersect: false,
                                },
                              }}
                            />
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="4">
                    <Row>
                      <Col md={12} xl={12} lg={12} sm={12} xs={12}>
                        <div className="card__title ">
                          <Button className="btn btn-warning products-list__btn-add" onClick={resetZoom}>Reset</Button>
                        </div>
                        <Card>
                          <CardBody>
                            <Line
                              ref={chartRef}
                              data={{
                                labels: loadingNumed && heartTime.map((e) => moment(e * 1000).format('DD MMM YYYY hh:mm')),
                                datasets: [{
                                  label: 'heart_rate',
                                  data: loadingNumed && heartData,
                                  fill: false,
                                  borderColor: 'rgb(45, 107, 50)',
                                  tension: 0.1,
                                },
                                // {
                                //   label: 'standard',
                                //   data: loadingNumed && standardHeartRate,
                                //   fill: false,
                                //   borderColor: 'rgb(110, 0, 0)',
                                //   tension: 0.1,
                                // }
                                ],
                              }}
                              options={{
                                plugins: {
                                  zoom: {
                                    zoom: {
                                      wheel: {
                                        enabled: true,
                                      },
                                      pinch: {
                                        enabled: true,
                                      },
                                      mode: 'xy',
                                    },
                                  },
                                },
                                maintainAspectRatio: true,
                                responsive: true,
                                elements: {
                                  point: {
                                    radius: 1,
                                  },
                                  line: {
                                    borderWidth: 1.5,
                                  },
                                },
                                interaction: {
                                  mode: 'index',
                                  intersect: false,
                                },
                              }}
                            />
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane> */}
                  <TabPane tabId="3">
                    <Row>
                      <Col md={12} xl={12} lg={12} sm={12} xs={12}>
                        <div className="card__title ">
                          <Button className="btn btn-warning products-list__btn-add" onClick={resetZoom}>Reset</Button>
                        </div>
                        <Card>
                          <CardBody>
                            <Line
                              ref={chartRef}
                              data={{
                                labels: RespiratoryTime.map((e) => moment(e * 1000).format('DD MMM YYYY hh:mm')),
                                datasets: [{
                                  label: 'respiratory_rate',
                                  data: RespiratoryData,
                                  fill: false,
                                  borderColor: '#2EC1AC',
                                  tension: 0.1,
                                },
                                {
                                  label: 'standard',
                                  data: standardRespiratoryRate,
                                  fill: false,
                                  borderColor: '#F66B0E',
                                  tension: 0.1,
                                },
                                ],
                              }}
                              options={{
                                plugins: {
                                  zoom: {
                                    zoom: {
                                      wheel: {
                                        enabled: true,
                                      },
                                      mode: 'x',
                                      speed: 100,
                                    },
                                    pan: {
                                      enabled: true,
                                      mode: 'x',
                                      speed: 100,
                                    },
                                  },
                                },
                                maintainAspectRatio: true,
                                responsive: true,
                                elements: {
                                  point: {
                                    radius: 1,
                                  },
                                  line: {
                                    borderWidth: 1.5,
                                  },
                                },
                                interaction: {
                                  mode: 'index',
                                  intersect: false,
                                },
                              }}
                            />
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="4">
                    <Row>
                      <Col md={12} xl={12} lg={12} sm={12} xs={12}>
                        <div className="card__title ">
                          <Button className="btn btn-warning products-list__btn-add" onClick={resetZoom}>Reset</Button>
                        </div>
                        <Card>
                          <CardBody>
                            <Line
                              ref={chartRef}
                              data={{
                                labels: TemperatureTime.map((e) => moment(e * 1000).format('DD MMM YYYY hh:mm')),
                                datasets: [{
                                  label: 'temperature',
                                  data: TemperatureData,
                                  fill: false,
                                  borderColor: '#FF008E',
                                  tension: 0.1,
                                },
                                {
                                  label: 'standard',
                                  data: standardTemperature,
                                  fill: false,
                                  borderColor: '#F66B0E',
                                  tension: 0.1,
                                },
                                ],
                              }}
                              options={{
                                plugins: {
                                  zoom: {
                                    zoom: {
                                      wheel: {
                                        enabled: true,
                                      },
                                      mode: 'x',
                                      speed: 100,
                                    },
                                    pan: {
                                      enabled: true,
                                      mode: 'x',
                                      speed: 100,
                                    },
                                  },
                                },
                                maintainAspectRatio: true,
                                responsive: true,
                                elements: {
                                  point: {
                                    radius: 1,
                                  },
                                  line: {
                                    borderWidth: 1.5,
                                  },
                                },
                                interaction: {
                                  mode: 'index',
                                  intersect: false,
                                },
                              }}
                            />
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Container>
  );
};

export default reduxForm({
  form: 'vsr_result', // a unique identifier for this form
})(VSRResult);
