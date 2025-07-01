/* eslint-disable max-len */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import EmoticonIcon from 'mdi-react/EmoticonIcon';
import CrosshairsGpsIcon from 'mdi-react/CrosshairsGpsIcon';
import { Card, CardBody, Col } from 'reactstrap';
import axios from 'axios';
import Panel from '../../../../shared/components/Panel';
import { LOCALSTORAGE_TOKEN } from '../../../../utils/Types';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  swipeToSlide: true,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 992, settings: { slidesToShow: 1 } },
    { breakpoint: 1200, settings: { slidesToShow: 2 } },
    { breakpoint: 1536, settings: { slidesToShow: 1 } },
    { breakpoint: 100000, settings: { slidesToShow: 2 } },
  ],
};

const PatientAlertCard = () => {
  const { t } = useTranslation('common');
  const [alert, setAlert] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setInterval(() => {
      const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      axios.get('SCHEMA://SERVER_ADDRESS/api/v1/iot/data/real', options)
        .then((res) => {
          setAlert(res.data);
          setLoading(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000);
  }, []);
  return (
    <Col md={4} xl={4} lg={4} xs={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <Panel xl={12} title={t('Patient Alerts')}>
            <Slider {...settings} className="dashboard__carousel">
              <div>
                <div className="dashboard__carousel-slide">
                  <CrosshairsGpsIcon />
                  <p className="dashboard__carousel-title">Room {loading && alert.alert[0][0]} / {loading && alert.alert[0][1]}</p>
                  {/* <p className="dashboard__carousel-title">Room {data} / Floor {data}</p> */}
                  <p>is need a help</p>
                </div>
              </div>
              <div>
                <div className="dashboard__carousel-slide dashboard__carousel-slide--red">
                  <EmoticonIcon />
                  <p className="dashboard__carousel-title">Room {loading && alert.alert[1][0]} / {loading && alert.alert[1][1]}</p>
                  {/* <p className="dashboard__carousel-title">Room {data} / Floor {data}</p> */}
                  <p>is need a help</p>
                </div>
              </div>
              <div>
                <div className="dashboard__carousel-slide dashboard__carousel-slide--yellow">
                  <EmoticonIcon />
                  <p className="dashboard__carousel-title">Room {loading && alert.alert[2][0]} / {loading && alert.alert[2][1]}</p>
                  {/* <p className="dashboard__carousel-title">Room {data} / Floor {data}</p> */}
                  <p>is need a help</p>
                </div>
              </div>
            </Slider>
          </Panel>
        </CardBody>
      </Card>
    </Col>
  );
};

export default PatientAlertCard;
