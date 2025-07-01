/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, Card, CardBody, Col, Spinner, Row, Container,
} from 'reactstrap';
import {
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalGridLines,
  XAxis,
  FlexibleWidthXYPlot,
  YAxis,
  DiscreteColorLegend,
} from 'react-vis';
import axios from 'axios';
import { ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { Field, reduxForm } from 'redux-form';
import { LOCALSTORAGE_TOKEN } from '../../../utils/Types';
import { STATISTIC_BEDCAPACITYPLANNING, STATISTIC_INPATIENTLENGTHOFSTAY, STATISTIC_INPATIENTSUMMARY } from '../../../utils/EndPoints';
import renderSelectField from '../../../shared/components/form/Select';

const DashboardHospitalManagement = () => {
  const { t } = useTranslation('common');
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const years = [];
  const firstYear = 2020;
  const thisYear = moment().year();

  for (let i = 0; i <= (thisYear - firstYear); i++) {
    years.push({
      value: (firstYear + i).toString(),
      label: (firstYear + i).toString(),
    });
  }

  // INPATIEN
  const [data, setData] = useState([]);
  // SUMMARY
  const [admitteds, setAdmitteds] = useState([]);
  const [deaths, setDeaths] = useState([]);

  const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  useEffect(() => {
    setLoading(true);
    axios.get(STATISTIC_BEDCAPACITYPLANNING, options)
      .then((res) => {
        setLoading(false);
        setRooms(res.data.room_allocation);
        setBeds(res.data.bed_occupied);
      })
      .catch((err) => {
        console.log('ERROR', err.response.data);
        setLoading(false);
      });
    axios.get(STATISTIC_INPATIENTLENGTHOFSTAY, options)
      .then((res) => {
        setLoading(false);
        setData(res.data.lengthStay);
      })
      .catch((err) => {
        console.log('ERROR', err.response.data);
        setLoading(false);
      });
    axios.get(STATISTIC_INPATIENTSUMMARY, options)
      .then((res) => {
        setLoading(false);
        setAdmitteds(res.data.admitted);
        setDeaths(res.data.death);
      })
      .catch((err) => {
        console.log('ERROR', err.response.data);
        setLoading(false);
      });
  }, []);
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12} lg={12}>
          <h3 className="page-title">Dashboard Hospital Management</h3>
        </Col>
      </Row>
      <Col xs={12} md={12} lg={12} xl={12}>
        <Card>
          <CardBody>
            <Container className="dashboard" md={12} xl={12} lg={6} xs={12}>
              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <Card>
                    <CardBody>
                      <div className="card__title">
                        <h5 className="bold-text">{t('Bed Capacity Planning')}</h5>
                        <div className="form form--horizontal">
                          <div className="form__form-group">
                            <span className="form__form-group-label">Filter By Year</span>
                            <div className="form__form-group-field">
                              <Field
                                name="year"
                                component={renderSelectField}
                                type="text"
                                placeholder="Select One"
                                options={years}
                                rules={{ required: true }}
                                required
                                onChange={(e) => setSelectedYear(e.value)}
                              />
                            </div>
                          </div>
                          <Button
                            className="form__button-toolbar"
                            onClick={() => {
                              setLoading(true);
                              axios.get(`${STATISTIC_BEDCAPACITYPLANNING}?year=${selectedYear}`, options).then((res) => {
                                setLoading(false);
                                setRooms(res.data.room_allocation);
                                setBeds(res.data.bed_occupied);
                              }).catch(() => {
                                setLoading(false);
                              });
                              axios.get(`${STATISTIC_INPATIENTLENGTHOFSTAY}?year=${selectedYear}`, options).then((res) => {
                                setLoading(false);
                                setData(res.data.lengthStay);
                              }).catch(() => {
                                setLoading(false);
                              });
                              axios.get(`${STATISTIC_INPATIENTSUMMARY}?year=${selectedYear}`, options).then((res) => {
                                setLoading(false);
                                setAdmitteds(res.data.admitted);
                                setDeaths(res.data.death);
                              }).catch(() => {
                                setLoading(false);
                              });
                            }}
                            color="primary"
                            size="sm"
                          >Submit
                          </Button>
                        </div>
                      </div>
                      {isLoading ? <Spinner /> : (
                        <div className="react-vis">
                          <Row>
                            <ResponsiveContainer width="100%" height={350}>
                              <FlexibleWidthXYPlot
                                xType="ordinal"
                                height={350}
                                xDistance={100}
                              >
                                <VerticalGridLines />
                                <HorizontalGridLines />
                                <XAxis />
                                <YAxis />
                                <VerticalBarSeries
                                  data={rooms}
                                  // data={[
                                  //   { x: 'Jan', y: 10 },
                                  //   { x: 'B', y: 5 },
                                  //   { x: 'C', y: 15 },
                                  //   { x: 'D', y: 15 },
                                  //   { x: 'E', y: 15 },
                                  //   { x: 'F', y: 15 },
                                  //   { x: 'G', y: 15 },
                                  //   { x: 'H', y: 15 },
                                  //   { x: 'I', y: 15 },
                                  //   { x: 'J', y: 15 },
                                  //   { x: 'K', y: 15 },
                                  //   { x: 'L', y: 15 },
                                  // ]}
                                  color="#70bbfd"
                                />
                                <VerticalBarSeries
                                  data={beds}
                                  // data={[
                                  //   { x: 'Jan', y: 12 },
                                  //   { x: 'B', y: 2 },
                                  //   { x: 'C', y: 11 },
                                  //   { x: 'D', y: 11 },
                                  //   { x: 'E', y: 11 },
                                  //   { x: 'F', y: 11 },
                                  //   { x: 'G', y: 11 },
                                  //   { x: 'H', y: 11 },
                                  //   { x: 'I', y: 11 },
                                  //   { x: 'J', y: 11 },
                                  //   { x: 'K', y: 11 },
                                  //   { x: 'L', y: 11 },
                                  // ]}
                                  color="#c88ffa"
                                />
                              </FlexibleWidthXYPlot>
                            </ResponsiveContainer>
                          </Row>
                          <Row>
                            <DiscreteColorLegend
                              // style={{ position: 'absolute', left: '50px', top: '10px' }}
                              orientation="horizontal"
                              items={[
                                {
                                  title: 'Room Allocation',
                                  color: '#70bbfd',
                                },
                                {
                                  title: 'Occupied',
                                  color: '#c88ffa',
                                },
                              ]}
                            />
                          </Row>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </CardBody>
        </Card>
      </Col>
      <Col xs={12} md={12} lg={12} xl={12}>
        <Card>
          <CardBody>
            <Container className="dashboard">
              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <Card>
                    <CardBody>
                      <div className="card__title">
                        <h5 className="bold-text">{t('Inpatient Length of Stay')}</h5>
                      </div>
                      {isLoading ? <Spinner /> : (
                        <div className="react-vis" dir="ltr">
                          <FlexibleWidthXYPlot
                            xType="ordinal"
                            height={250}
                            xDistance={100}
                          >
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis />
                            <YAxis />
                            <VerticalBarSeries
                              data={data}
                              color="#70bbfd"
                            />
                            {/* <VerticalBarSeries
                data={[
                  { x: 'A', y: 12 },
                  { x: 'B', y: 2 },
                  { x: 'C', y: 11 },
                ]}
                color="#c88ffa"
              /> */}
                          </FlexibleWidthXYPlot>
                          <DiscreteColorLegend
                // style={{ position: 'absolute', left: '50px', top: '10px' }}
                            orientation="horizontal"
                            items={[
                              {
                                title: 'Length of Stay',
                                color: '#70bbfd',
                              },
                            ]}
                          />
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </CardBody>
        </Card>
      </Col>
      <Col xs={12} md={12} lg={12} xl={12}>
        <Card>
          <CardBody>
            <Container className="dashboard">
              <Row>
                <Col xs={12} md={12} lg={12} xl={12}>
                  <Card>
                    <CardBody>
                      <div className="card__title">
                        <h5 className="bold-text">{t('Inpatient Summary')}</h5>
                      </div>
                      {isLoading ? <Spinner /> : (
                        <div className="react-vis" dir="ltr">
                          <FlexibleWidthXYPlot
                            xType="ordinal"
                            height={250}
                            xDistance={100}
                          >
                            <VerticalGridLines />
                            <HorizontalGridLines />
                            <XAxis />
                            <YAxis />
                            <VerticalBarSeries
                              data={admitteds}
                              color="#70bbfd"
                            />
                            <VerticalBarSeries
                              data={deaths}
                              color="#c88ffa"
                            />
                          </FlexibleWidthXYPlot>
                          <DiscreteColorLegend
                // style={{ position: 'absolute', left: '50px', top: '10px' }}
                            orientation="horizontal"
                            items={[
                              {
                                title: 'Admitteds',
                                color: '#70bbfd',
                              },
                              {
                                title: 'Deaths',
                                color: '#c88ffa',
                              },
                            ]}
                          />
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </CardBody>
        </Card>
      </Col>
    </Container>
  );
};

export default reduxForm({
  form: 'filter_form',
})(DashboardHospitalManagement);
