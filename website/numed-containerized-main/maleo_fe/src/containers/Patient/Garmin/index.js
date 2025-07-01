/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/prefer-default-export */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import 'chartjs-plugin-zoom';
import { useLocation } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Button,
  Container,
  Col,
  Card,
  CardBody,
  Row,
} from 'reactstrap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// const SERVER_URL = 'https://ec2-108-136-40-244.ap-southeast-3.compute.amazonaws.com';
// const SERVER_URL = "https://ec2-108-136-227-7.ap-southeast-3.compute.amazonaws.com";
const SERVER_URL = 'SCHEMA://SERVER_ADDRESS';
const FE_URL = SERVER_URL;
const BE_URL = `${SERVER_URL}/api/v1/garminbe`;
const REQUEST_TOKEN_URL = `${BE_URL}/auth/request-token`;
const USER_TOKEN_URL = `${BE_URL}/auth/user-token`;
const GET_HEARTRATE = `${BE_URL}/health/heartRate`;
const GET_RESPIRATION = `${BE_URL}/health/respiration`;
const GET_PULSEOX = `${BE_URL}/health/pulseOx`;
const FE_GARMIN_HOME = `${FE_URL}/patient/garmin/index`;

function RGBA(r, g, b, a = 1) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function RGB(r, g, b) {
  return RGBA(r, g, b);
}

async function requestHeartRateData(start_time, end_time) {
  const token = localStorage.getItem('user_access_token');
  const endpoint = `${GET_HEARTRATE}/${token}/?measure_start=${start_time}&measure_end=${end_time}`;
  const { data } = await axios.get(endpoint);
  return data;
}

async function requestRespirationData(start_time, end_time) {
  console.log(start_time, end_time);
  const token = localStorage.getItem('user_access_token');
  //   const endpoint = `https://ec2-108-136-40-244.ap-southeast-3.compute.amazonaws.com/api/v1/garminbe/health/respiration/65b30120-d962-4d18-834a-36bfbdd5b2fb/?measure_start=${start_time}&measure_end=${end_time}`;
  const endpoint = `${GET_RESPIRATION}/${token}`;
  const { data } = await axios.get(endpoint);
  return data;
}

async function requestPulseOxData(start_time, end_time) {
  console.log(start_time, end_time);
  const token = localStorage.getItem('user_access_token');
  const endpoint = `${GET_PULSEOX}/${token}`;
  //   const endpoint = `https://ec2-108-136-40-244.ap-southeast-3.compute.amazonaws.com/api/v1/garminbe/health/pulseOx/65b30120-d962-4d18-834a-36bfbdd5b2fb/?measure_start=${start_time}&measure_end=${end_time}`;
  const { data } = await axios.get(endpoint);
  return data;
}

function createChartJsData({
  label, data, get_labels, get_data,
}) {
  // const showCount = 10;
  const labels = data.map(get_labels);

  const datasets = [
    {
      label,
      data: data.map(get_data),
      borderColor: RGB(255, 99, 132),
      backgroundcolor: RGBA(255, 99, 132, 0.5),
      parsing: {
        yAxisKey: 'y',
      },
      tension: 0.3,
    },
  ];
  return ({
    labels,
    datasets,
  });
}

const CHART_HR = 'Heart Rate';
const CHART_PULSEOX = 'O2';
const CHART_RESP = 'Respiration';

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Garmin = () => {
  const query = useQuery();
  const EmptyData = ({ title }) => ({
    labels: [],
    datasets: [
      {
        label: title,
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });

  // const [startTime, setStartTime] = useState(0);
  // const [endTime, setEndTime] = useState(0);

  const [hrData, setHrData] = useState(EmptyData({
    title: 'Heart Rate',
  }));

  const [respData, setRespData] = useState(EmptyData({
    title: 'Respiration',
  }));

  const [pulseOxData, setPulseOxData] = useState(EmptyData({
    title: 'PulseOx',
  }));

  const GenericOptions = () => ({
    zoom: {
      enabled: true,
      mode: 'x',
    },
    pan: {
      enabled: true,
      mode: 'x',
    },
    responsive: true,
    plugins: {
      // legend: {
      //     position: 'top'
      // },
      // title: {
      //     display: true,
      //     text: title
      // },
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
    scales: {
      xAxes: {
        ticks: {
          display: false,
          autoSkip: true,
          maxTicksLimit: 1,
        },
      },
    },
    parsing: {
      xAxisKey: 'x',
      yAxisKey: 'y',
    },
    maintainAspectRatio: true,
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
  });
  // const [isExpired, setIsExpired] = useState(true);
  useEffect(() => {
    if (query.get('oauth_verifier')) {
      localStorage.setItem('oauth_verifier', query.get('oauth_verifier'));
    }
    const req_data = {
      // oauth_callback: 'http://localhost:3000/patient/garmin/index',
      oauth_callback: FE_GARMIN_HOME,
    };
    // request token
    axios.post(REQUEST_TOKEN_URL, req_data)
      .then((res) => {
        console.log('request-token', res);
        localStorage.setItem('oauth_token', res.data.oauth_token);
        localStorage.setItem('oauth_token_secret', res.data.oauth_token_secret);
        localStorage.setItem('permissionUrl', res.data.permissionUrl);
      })
      .catch((err) => {
        console.log(err);
      });
    // post akses token
    const req_data1 = {
      oauth_token: localStorage.getItem('oauth_token'),
      oauth_token_secret: localStorage.getItem('oauth_token_secret'),
      oauth_verifier: localStorage.getItem('oauth_verifier'),
    };
    axios.post(USER_TOKEN_URL, req_data1)
      .then((res) => {
        console.log('user-token', res);
        localStorage.setItem('user_access_token', res.data.oauth_token);
      })
      .catch((err) => {
        console.log('wqwqw', err.response.data.detail);
        // if (err.response.data.detail === 'access token is already expired') {
        //   setIsExpired(false);
        //   localStorage.removeItem('user_access_token');
        // }
      });
  }, []);

  const UpdateAllCharts = async () => {
    const _endTime = Date.now() / 1000;
    const _startTime = _endTime - 24 * 3600;
    const _hrData = createChartJsData({
      label: 'Heart Rate',
      data: await requestHeartRateData(_startTime, _endTime),
      get_labels: (val) => (new Date(val.timestamp * 1000)).toLocaleString(),
      get_data: (val) => val.heartRate,
    });
    const _respData = createChartJsData({
      label: 'Respiration',
      data: await requestRespirationData(_startTime, _endTime),
      get_labels: (val) => (new Date(val.timestamp * 1000)).toLocaleString(),
      get_data: (val) => val.respiration,
    });
    const _pulseOxData = createChartJsData({
      label: 'PulseOx',
      data: await requestPulseOxData(_startTime, _endTime),
      get_labels: (val) => (new Date(val.timestamp * 1000)).toLocaleString(),
      get_data: (val) => val.pulseOx,
    });
    setHrData(_hrData);
    setRespData(_respData);
    setPulseOxData(_pulseOxData);
  };

  const [currentChart, setCurrentChart] = useState(CHART_HR);

  const showChart = (currChart) => {
    if (currChart === CHART_HR) {
      return (
        <Line
          options={GenericOptions({})}
          data={hrData}
        />
      );
    } if (currChart === CHART_PULSEOX) {
      return (
        <Line
          options={GenericOptions({})}
          data={respData}
        />
      );
    }
    return (
      <Line
        options={GenericOptions({})}
        data={pulseOxData}
      />
    );
  };
  // console.log(isExpired);
  return (
    <Container className="dashboard">
      <Row>
        <Col md={12}>
          <h3 className="page-title">Garmin Integration</h3>
        </Col>
      </Row>
      <Col md={12} xl={12} lg={12} sm={12} xs={12}>
        <Card>
          <CardBody>
            <div className="control-container">

              <Row>
                <Button
                  color="primary"
                  onClick={() => {
                    window.open(localStorage.getItem('permissionUrl'));
                  }}
                >Login
                </Button>
                <Button
                  color="success"
                  onClick={UpdateAllCharts}
                >Sync
                </Button>
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                            // color="dark"
                    color="success"
                  >
                    {currentChart}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>Charts</DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem onClick={() => { setCurrentChart(CHART_HR); }}>
                      {CHART_HR}
                    </DropdownItem>
                    <DropdownItem onClick={() => { setCurrentChart(CHART_PULSEOX); }}>
                      {CHART_PULSEOX}
                    </DropdownItem>
                    <DropdownItem onClick={() => { setCurrentChart(CHART_RESP); }}>
                      {CHART_RESP}
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

              </Row>

              {showChart(currentChart)}

            </div>
          </CardBody>
        </Card>
      </Col>

    </Container>
  );
};

export default Garmin;
