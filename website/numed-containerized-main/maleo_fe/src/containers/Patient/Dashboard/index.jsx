/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState, useRef } from 'react';
import {
  Col, Container, Row, Card, CardBody, Button,
} from 'reactstrap';
import axios from 'axios';
import Toolbar from '@material-ui/core/Toolbar';
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-zoom';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import { useTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import FilterListIcon from 'mdi-react/FilterListIcon';
// import { Link } from 'react-router-dom';
import { BLOODTEST_MEDICALRECORD, STANDART_BLOODTEST_MEDICALRECORD } from '../../../utils/EndPoints';
import { LOCALSTORAGE_TOKEN } from '../../../utils/Types';
import History from './History/index';

const DashboardPatient = () => {
  const { t } = useTranslation('common');
  const [bloodTest, setbloodTest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // standartd
  const [standard, setStandart] = useState([]);
  const [standardLow, setStandartlow] = useState([11.7]);
  const [standardHight, setStandartHight] = useState([15.5]);
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  useEffect(() => {
    axios.get(BLOODTEST_MEDICALRECORD, options)
      .then((res) => {
        setbloodTest(res.data);
        setLoading(true);
        const data = res.data
          ? res.data.map((e) => `${e.hb}`) : (
            []
          );
        setSelected(data);
        setSelectedLabel('Hemoglobin (hb) (U/L)');
        const low = res.data ? res.data.map(() => 11.7) : [];
        const hight = res.data ? res.data.map(() => 15.5) : [];
        setStandartlow(low);
        setStandartHight(hight);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(STANDART_BLOODTEST_MEDICALRECORD, options)
      .then((res) => {
        // setbloodTest(res.data);
        setLoading(true);
        console.log('res.data', res.data);
        const data = res.data
          ? res.data.map((e) => `${e.type === 'hb'}`) : (
            []
          );
        setStandart(data);
        // setSelectedLabel('Alkaline Phospohatase (alp) (U/L)');
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log('standar', standard);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const chartRef = useRef(null);
  const resetZoom = () => {
    chartRef.current.resetZoom();
  };
  return (
    <Container className="dashboard">
      <Row>
        <Col xs={6} md={6} lg={6} xl={6}>
          <h3 className="page-title">{t('patient.dashboard.page_title')}</h3>
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <CardBody className="dashboard__booking-card">
              <div className="card__title ">
                <h5 className="bold-text">{t('patient.dashboard.blood_trend')}</h5>
                <br />
                <Row>
                  <Col md={4} lg={4}>
                    <div className="d-flex">
                      <input
                        className="date-picker"
                        type="date"
                        name="start"
                        onChange={(e) => {
                          setStartDate(e.target.value);
                        }}
                      />
                      &nbsp;&nbsp;
                      <input
                        className="date-picker"
                        type="date"
                        name="end"
                        onChange={(e) => {
                          setEndDate(e.target.value);
                        }}

                      />
                    </div>
                  </Col>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => {
                      axios.get(`${BLOODTEST_MEDICALRECORD}?start=${startDate}&end=${endDate}`, options)
                        .then((res) => {
                          setbloodTest(res.data);
                          setLoading(true);
                          const data = res.data
                            ? res.data.map((e) => `${e.alp}`) : (
                              []
                            );
                          setSelected(data);
                          setSelectedLabel('alp');
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                      axios.get(STANDART_BLOODTEST_MEDICALRECORD, options)
                        .then((res) => {
                          setbloodTest(res.data);
                          setLoading(true);
                          const data = res.data
                            ? res.data.map((e) => `${e.alp}`) : (
                              []
                            );
                          setStandart(data);
                          // setSelectedLabel('Alkaline Phospohatase (alp) (U/L)');
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                  >
                    Submit
                  </Button>
                </Row>
                <br />

              </div>
              <div className="material-table__toolbar-wrap">
                <Toolbar className="material-table__toolbar">
                  <div>
                    <div>
                      <span>
                        <span>Filter By</span>
                        <span>
                          <IconButton
                            className="material-table__toolbar-button"
                            aria-owns={anchorEl ? 'simple-menu' : null}
                            aria-haspopup="true"
                            onClick={handleClick}
                          >
                            <FilterListIcon />
                          </IconButton>
                        </span>
                      </span>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        className="material-table__filter-menu"
                      >
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.hb}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('HB');
                            const low = loading && bloodTest ? bloodTest.map(() => 11.7) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 15.7) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Hemoglobin (HB)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.hct}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('HCT');
                            const low = loading && bloodTest ? bloodTest.map(() => 35) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 47) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Hematocrit (HCT)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.leko}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('LEKO');
                            const low = loading && bloodTest ? bloodTest.map(() => 15) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 20) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Leukocytes (LEKO)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.plt}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('PLT');
                            const low = loading && bloodTest ? bloodTest.map(() => 150) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 440) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Platelets (PLT)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.eri}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('ERI');
                            const low = loading && bloodTest ? bloodTest.map(() => 3.8) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 5.2) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Erythrocytes (eri)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.rdw}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('RDW');
                            const low = loading && bloodTest ? bloodTest.map(() => 12) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 15) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Red Call Distribution Width (RDW)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.mcv}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('MCV');
                            const low = loading && bloodTest ? bloodTest.map(() => 80) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 100) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Mean Corpuscular Volume (MCV)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.mch}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('MCH');
                            const low = loading && bloodTest ? bloodTest.map(() => 26) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 34) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Mean Corpuscular Hemoglobin (MCH)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.mchc}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('MCHC');
                            const low = loading && bloodTest ? bloodTest.map(() => 32) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 36) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Mean Corpuscular Hemoglobin (MCHC)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.basofil}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('BASOFIL');
                            const low = loading && bloodTest ? bloodTest.map(() => 0) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 1) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Basophils (BASOFIL)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.eos}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('EOS');
                            const low = loading && bloodTest ? bloodTest.map(() => 2) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 4) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Eosinophils (EOS)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.neutb}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('NEUTB');
                            const low = loading && bloodTest ? bloodTest.map(() => 3) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 5) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Stem Neutrophils (NEUTB)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.segmen}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('SEGMEN');
                            const low = loading && bloodTest ? bloodTest.map(() => 50) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 70) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Segmented Neutrophils (SEGMEN)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.limfosit}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('LIMFOSIT');
                            const low = loading && bloodTest ? bloodTest.map(() => 25) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 50) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Lymphocytes (LIMFOSIT)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.monosit}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('MONOSIT');
                            const low = loading && bloodTest ? bloodTest.map(() => 2) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 8) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Monocytes (MONOSIT)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.nlr1}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('NLR1');
                            const low = loading && bloodTest ? bloodTest.map(() => 0) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 3.12) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Neutrophil-Lymphocyte Ratio (NLR1)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.led}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('LED');
                            const low = loading && bloodTest ? bloodTest.map(() => 0) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 20) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Erythrocyte Sedimentation Rate (LED)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.po2_n}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('PO2 N');
                            const low = loading && bloodTest ? bloodTest.map(() => 72) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 104) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Partial Pressure Of Oxygen (PO2_N)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.o2s_n}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('O2S N');
                            const low = loading && bloodTest ? bloodTest.map(() => 90) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 100) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Oxygen Saturation (O2S_N)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.sgot}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('SGOT');
                            const low = loading && bloodTest ? bloodTest.map(() => 0) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 35) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Serum Glutamic Oxaloacetic Transaminase (SGOT)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.sgpt}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('SGPT');
                            const low = loading && bloodTest ? bloodTest.map(() => 0) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 35) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Serum Glutamic Pyruvic Transaminase (SGPT)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.gsdfull}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('GSDFULL');
                            const low = loading && bloodTest ? bloodTest.map(() => 70) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 180) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >gRandom Plasma Glucose Test (GDSFULL)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.ureum}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('UREUM');
                            const low = loading && bloodTest ? bloodTest.map(() => 0) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 48) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Urea (UREUM)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.creat}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('CREAT');
                            const low = loading && bloodTest ? bloodTest.map(() => 0.6) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 1.1) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Creatine (CREAT)
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.ldh}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('LDH');
                            const low = loading && bloodTest ? bloodTest.map(() => 105) : [];
                            const hight = loading && bloodTest ? bloodTest.map(() => 333) : [];
                            setStandartlow(low);
                            setStandartHight(hight);
                          }}
                        >Lactate Dehydrogenase (LDH)
                        </MenuItem>
                        {/* <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.cl}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('CL');
                          }}
                        >CL
                        </MenuItem> */}
                        {/* <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.k}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('K');
                          }}
                        >K
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.na}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('NA');
                          }}
                        >NA
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.bildirek}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('BILDIREK');
                          }}
                        >BILDIREK
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.bilindir}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('BILINDIR');
                          }}
                        >BILINDIR
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.biltot}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('BILTOT');
                          }}
                        >BILTOT
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.hco3_n}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('HCO3 N');
                          }}
                        >HCO3 N
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.pco2_n}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('PCO2 N');
                          }}
                        >PCO2 N
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.ph_nu}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('PH NU');
                          }}
                        >PH NU
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.tco2_n}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('TCO2 N');
                          }}
                        >TCO2 N
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.ptinr}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('PTINR');
                          }}
                        >PTINR
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.bjurin}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('BJURIN');
                          }}
                        >BJURIN
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.phurin}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('PHURIN');
                          }}
                        >PHURIN
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.choles}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('CHOLES');
                          }}
                        >CHOLES
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.gdpfull}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('GDPFULL');
                          }}
                        >GDPFULL
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.gdppfull}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('GDPPFULL');
                          }}
                        >GDPPFULL
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.hdlcho}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('HDLCHO');
                          }}
                        >HDLCHO
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.ldlcho}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('LDLCHO');
                          }}
                        >LDLCHO
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.trigl}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('TRIGL');
                          }}
                        >TRIGL
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.ua}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('UA');
                          }}
                        >UA
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.tshsnew}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('TSHSNEW');
                          }}
                        >TSHSNEW
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.albcp}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('ALBCP');
                          }}
                        >ALBCP
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.tp}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('TP');
                          }}
                        >TP
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.t4}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('T4');
                          }}
                        >T4
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.caltot}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('CALTOT');
                          }}
                        >CALTOT
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.mg}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('MG');
                          }}
                        >MG
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.glurapid}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('GLURAPID');
                          }}
                        >GLURAPID
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.hdld}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('HDLD');
                          }}
                        >HDLD
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.alp}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('ALP');
                          }}
                        >ALP
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.ggt}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('GGT');
                          }}
                        >GGT
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.glob}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('GLOB');
                          }}
                        >GLOB
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.ft4}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('FT4');
                          }}
                        >FT4
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.lakt_dr}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('LAKT DR');
                          }}
                        >LAKT DR
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.acp001}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('ACP001');
                          }}
                        >ACP001
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.acp002}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('ACP002');
                          }}
                        >ACP002
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.acp009}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('ACP009');
                          }}
                        >ACP009
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.cglu}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('CGLU');
                          }}
                        >CGLU
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.cldh}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('CLDH');
                          }}
                        >CLDH
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.cprot}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('CPROT');
                          }}
                        >CPROT
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.sglu}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('SGLU');
                          }}
                        >SGLU
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.sldh}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('SLDH');
                          }}
                        >SLDH
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.aca001}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('ACA001');
                          }}
                        >ACA001
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.aca002}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('ACA002');
                          }}
                        >ACA002
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.aca009}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('ACA009');
                          }}
                        >ACA009
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.cglua}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('CGLUA');
                          }}
                        >CGLUA
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.cldha}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('CLDHA');
                          }}
                        >CLDHA
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.cprota}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('CPROTA');
                          }}
                        >CPROTA
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.sglua}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('SGLUA');
                          }}
                        >SGLUA
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.sldha}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('SLDHA');
                          }}
                        >SLDHA
                        </MenuItem>
                        <MenuItem
                          className="material-table__filter-menu-item"
                          onClick={() => {
                            const data = loading && bloodTest
                              ? bloodTest.map((e) => `${e.sprota}`) : (
                                []
                              );
                            setSelected(data);
                            setSelectedLabel('SPROTA');
                          }}
                        >SPROTA
                        </MenuItem> */}
                      </Menu>
                    </div>
                  </div>
                </Toolbar>
              </div>
              <div className="card__title ">
                <Button className="btn btn-warning products-list__btn-add" onClick={resetZoom}>Reset</Button>
              </div>

              <Line
                ref={chartRef}
                data={{
                  labels: loading && bloodTest
                    ? bloodTest.map((e) => `${e.created_at}`) : (
                      []
                    ),
                  datasets: [{
                    label: selectedLabel,
                    data: selected,
                    fill: false,
                    drawActiveElementsOnTop: false,
                    borderColor: 'rgb(75, 192, 100)',
                    tension: 0.1,
                  },
                  {
                    label: 'upper normal',
                    data: standardHight,
                    fill: false,
                    borderColor: '#C21010',
                    tension: 0.1,
                  },
                  {
                    label: 'low normal',
                    data: standardLow,
                    fill: false,
                    borderColor: '#FFB200',
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
        <History />
      </Row>
    </Container>
  );
};
export default DashboardPatient;
