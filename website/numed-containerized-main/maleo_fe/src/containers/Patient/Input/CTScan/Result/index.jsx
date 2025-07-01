/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Col, Container, Row, Card, CardBody, ButtonToolbar, Button, Modal, ModalHeader, ModalBody,
} from 'reactstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory, Link } from 'react-router-dom';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { CTSCANCOMPARE_MEDICALRECORD, CTSCAN_MEDICALRECORD } from '../../../../../utils/EndPoints';
import DoctorNotes from './components/DoctorNotes';
import Carousel from '../../../../../shared/components/carousel/CarouselSingle';

import Ava1 from '../../../../../shared/img/assets/ctscan_diagnosis.png';

const CTScanResult = () => {
  const { t } = useTranslation('common');
  const params = useParams();
  const [ctscanRecord, setctscanRecord] = useState([]);
  const [compare, setCompare] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [show, setShow] = useState(true);
  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    axios.get(`${CTSCAN_MEDICALRECORD}${params.id}/`, options)
      .then((res) => {
        setctscanRecord(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Container className="dashboard">

      <div className="card__title">
        <ButtonToolbar className="form__button-toolbar">
          <Button color="primary" onClick={history.goBack}>
            {t('ui.btn.back')}
          </Button>
        </ButtonToolbar>
        <ButtonToolbar className="products-list__btn-toolbar-top">
          <Link className="btn btn-primary products-list__btn-add" to="/patient-data/patient/upload/ct-scan">
            {t('ui.btn.new')}
          </Link>
          {
            show
              ? (
                <Button
                  className="btn btn-primary products-list__btn-add"
                  color="primary"
                  onClick={() => {
                    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
                    const options = {
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                      },
                    };
                    axios.get(`${CTSCANCOMPARE_MEDICALRECORD}${params.id}/`, options)
                      .then((res) => {
                        setCompare(res.data);
                        if (!res.data.status) {
                          setModal(true);
                        } else {
                          setShow(false);
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  Compare
                </Button>
              ) : (
                <Button
                  className="btn btn-primary products-list__btn-add"
                  onClick={() => {
                    setCompare(null);
                    setShow(true);
                  }}
                >
                  Cancel
                </Button>
              )
          }
        </ButtonToolbar>
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader oggle={toggle}>Comparing Data</ModalHeader>
        <ModalBody>
          Data is'not available
        </ModalBody>
        {/* <ModalFooter>
            <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter> */}
      </Modal>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody className="dashboard__title-card">
              <div>
                <div className="dashboard__title-card">
                  <div className="product-card__info">
                    <h1 className="product-card__title">{t('patient.input.ctscan.here')}<span className="red-text"> {t('patient.input.ctscan.based')}</span></h1>
                    <h3 className="page-subhead subhead">
                      Name: {loading ? ctscanRecord.patient_detail.fullname : ''} - {loading ? ctscanRecord.patient_detail.mr_id_patient : ''}
                    </h3>
                    <h3 className="page-subhead subhead">{t('ui.info.upload_on')} {loading ? ctscanRecord.created_at : ''}
                    </h3>
                  </div>
                </div>
              </div>

            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12} xl={6} lg={6} xs={12}>
          <Card>
            <CardBody className="dashboard__booking-card">
              <div className="dashboard__booking-total-container">
                <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                  {(ctscanRecord.diagnosis)}
                </h5>
                <div className="dashboard__competitor-img">
                  <img src={Ava1} alt="" />
                </div>
              </div>
              <h5 className="dashboard__booking-total-description">Diagnosis</h5>
            </CardBody>
          </Card>
        </Col>
        <Col md={12} xl={6} lg={6} xs={12}>
          <Card>
            <CardBody className="dashboard__booking-card">
              <div className="dashboard__booking-total-container">
                <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                  {loading ? ctscanRecord.confidence.toFixed(2) : ''}
                </h5>
                <div className="dashboard__competitor-img">
                  <img src={Ava1} alt="" />
                </div>
              </div>
              <h5 className="dashboard__booking-total-description">Confidence</h5>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {
        compare !== null
      && (compare.status
        && (
          <Row>
            <Col md={12} xl={6} lg={6} xs={12}>
              <Card>
                <CardBody className="dashboard__booking-card">
                  <div className="dashboard__booking-total-container">
                    <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                      {(compare.data.diagnosis)}
                    </h5>
                    <div className="dashboard__competitor-img">
                      <img src={Ava1} alt="" />
                    </div>
                  </div>
                  <h5 className="dashboard__booking-total-description">Diagnosis</h5>
                </CardBody>
              </Card>
            </Col>
            <Col md={12} xl={6} lg={6} xs={12}>
              <Card>
                <CardBody className="dashboard__booking-card">
                  <div className="dashboard__booking-total-container">
                    <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                      {compare.data.confidence.toFixed(2)}
                    </h5>
                    <div className="dashboard__competitor-img">
                      <img src={Ava1} alt="" />
                    </div>
                  </div>
                  <h5 className="dashboard__booking-total-description">Confidence</h5>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )
      )
      }
      <Row>
        <Col md={12} lg={6} xl={6}>
          <Card>
            <CardBody className="dashboard__booking-card">
              <Carousel>
                <div>
                  <a href={ctscanRecord.image_result} target="blank">
                    <img src={ctscanRecord.image_result} alt="cxr-img" />
                  </a>
                </div>
              </Carousel>
              <p className="slick-slider__caption-title">Overlay Image of your CT-Scan</p>
              <Button
                size="sm"
                color="success"
                href={ctscanRecord.image_result}
              >download
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md={12} lg={6} xl={6}>
          <Card>
            <CardBody className="dashboard__booking-card">
              <Carousel>
                <div>
                  <a href={ctscanRecord.image} target="blank">
                    <img src={ctscanRecord.image} alt="cxr-img" />
                  </a>
                </div>
              </Carousel>
              <p className="slick-slider__caption-title">Original Image of your CT-Scan</p>
              <Button
                size="sm"
                color="success"
                href={ctscanRecord.image}
              >download
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {
        compare !== null
      && (compare.status
        ? (
          <Row>
            <Col md={12} lg={6} xl={6}>
              <Card>
                <CardBody className="dashboard__booking-card">
                  <Carousel>
                    <div>
                      <a href={compare.data.image_result} target="blank">
                        <img src={compare.data.image_result} alt="cxr-img" />
                      </a>
                    </div>
                  </Carousel>
                  <p className="slick-slider__caption-title">Overlay Image of your CXR</p>
                  <Button
                    size="sm"
                    color="success"
                    href={compare.data.image_result}
                  >download
                  </Button>
                </CardBody>
              </Card>
            </Col>
            <Col md={12} lg={6} xl={6}>
              <Card>
                <CardBody className="dashboard__booking-card">
                  <Carousel>
                    <div>
                      <a href={compare.data.image} target="blank">
                        <img src={compare.data.image} alt="cxr-img" />
                      </a>
                    </div>
                  </Carousel>
                  <p className="slick-slider__caption-title">Original Image of your CXR</p>
                  <Button
                    size="sm"
                    color="success"
                    href={compare.data.image}
                  >download
                  </Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : 'Data Tidak Tersedia'
      )
      }
      <Row>
        <DoctorNotes />
      </Row>
    </Container>
  );
};

export default CTScanResult;
