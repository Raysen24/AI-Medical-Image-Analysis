/* eslint-disable react/no-unescaped-entities */
/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  Col, Container, Row, Card, CardBody, ButtonToolbar, Button, Modal, ModalHeader, ModalBody,
} from 'reactstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory, Link } from 'react-router-dom';
import Carousel from '../../../../../shared/components/carousel/CarouselSingle';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { CXR_MEDICALRECORD, CXRCOMPARE_MEDICALRECORD } from '../../../../../utils/EndPoints';
import DoctorNotes from './components/DoctorNotes';

import Ava1 from '../../../../../shared/img/assets/cxr_pneumonia.png';
import Ava2 from '../../../../../shared/img/assets/cxr_covid.png';
import Ava3 from '../../../../../shared/img/assets/cxr_normal.png';

const CXRResult = () => {
  const { t } = useTranslation('common');
  const params = useParams();
  const [cxrRecord, setcxrRecord] = useState([]);
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
    axios.get(`${CXR_MEDICALRECORD}${params.id}/`, options)
      .then((res) => {
        setcxrRecord(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // console.log(compare, show);
  return (
    <Container className="dashboard">
      <div className="card__title">
        <ButtonToolbar className="form__button-toolbar">
          <Button color="primary" onClick={history.goBack}>
            {t('ui.btn.back')}
          </Button>
        </ButtonToolbar>
        <ButtonToolbar className="products-list__btn-toolbar-top">
          <Link className="btn btn-primary products-list__btn-add" to="/patient-data/upload/cxr">
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
                    axios.get(`${CXRCOMPARE_MEDICALRECORD}${params.id}/`, options)
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
      </Modal>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody className="dashboard__title-card">
              <div>
                <div className="dashboard__title-card">
                  <div className="product-card__info">
                    <h1 className="product-card__title">
                      {t('patient.input.cxr.here')}
                      <span className="red-text"> {t('patient.input.cxr.based')}</span>
                    </h1>
                    <h3 className="page-subhead subhead">
                      Name: {loading ? cxrRecord.patient_detail.fullname : ''} - {loading ? cxrRecord.patient_detail.mr_id_patient : ''}
                    </h3>
                    <h3 className="page-subhead subhead">{t('ui.info.upload_on')} {loading ? cxrRecord.created_at : ''}
                    </h3>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12} xl={4} lg={6} xs={12}>
          <Card>
            <CardBody className="dashboard__booking-card">
              <div className="dashboard__booking-total-container">
                <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                  {loading ? cxrRecord.pneumonia.toFixed(2) : ''}%
                </h5>
                <div className="dashboard__competitor-img">
                  <img src={Ava1} alt="" />
                </div>
              </div>
              <h5 className="dashboard__booking-total-description">Pneumonia</h5>
            </CardBody>
          </Card>
        </Col>
        <Col md={12} xl={4} lg={6} xs={12}>
          <Card>
            <CardBody className="dashboard__booking-card">
              <div className="dashboard__booking-total-container">
                <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                  {loading ? cxrRecord.covid.toFixed(2) : ''}%
                </h5>
                <div className="dashboard__competitor-img">
                  <img src={Ava2} alt="" />
                </div>
              </div>
              <h5 className="dashboard__booking-total-description">Covid-19</h5>
            </CardBody>
          </Card>
        </Col>
        <Col md={12} xl={4} lg={6} xs={12}>
          <Card>
            <CardBody className="dashboard__booking-card">
              <div className="dashboard__booking-total-container">
                <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                  {loading ? cxrRecord.normal.toFixed(2) : ''}%
                </h5>
                <div className="dashboard__competitor-img">
                  <img src={Ava3} alt="" />
                </div>
              </div>
              <h5 className="dashboard__booking-total-description">Normal</h5>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {
        compare !== null
      && (compare.status
        && (
          <Row>
            <Col md={12} xl={4} lg={6} xs={12}>
              <Card>
                <CardBody className="dashboard__booking-card">
                  <div className="dashboard__booking-total-container">
                    <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                      {compare.data.pneumonia.toFixed(2)}%
                    </h5>
                    <div className="dashboard__competitor-img">
                      <img src={Ava1} alt="" />
                    </div>
                  </div>
                  <h5 className="dashboard__booking-total-description">Pneumonia</h5>
                </CardBody>
              </Card>
            </Col>
            <Col md={12} xl={4} lg={6} xs={12}>
              <Card>
                <CardBody className="dashboard__booking-card">
                  <div className="dashboard__booking-total-container">
                    <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                      {compare.data.covid.toFixed(2)}%
                    </h5>
                    <div className="dashboard__competitor-img">
                      <img src={Ava2} alt="" />
                    </div>
                  </div>
                  <h5 className="dashboard__booking-total-description">Covid-19</h5>
                </CardBody>
              </Card>
            </Col>
            <Col md={12} xl={4} lg={6} xs={12}>
              <Card>
                <CardBody className="dashboard__booking-card">
                  <div className="dashboard__booking-total-container">
                    <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                      {compare.data.normal.toFixed(2)}%
                    </h5>
                    <div className="dashboard__competitor-img">
                      <img src={Ava3} alt="" />
                    </div>
                  </div>
                  <h5 className="dashboard__booking-total-description">Normal</h5>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ))
}
      <Row>
        <Col md={12} lg={6} xl={6}>
          <Card>
            <CardBody className="dashboard__booking-card">
              <Carousel>
                <div>
                  <a href={cxrRecord.image_result} target="blank">
                    <img src={cxrRecord.image_result} alt="cxr-img" />
                  </a>
                </div>
              </Carousel>
              <p className="slick-slider__caption-title">Overlay Image of your CXR</p>
              <Button
                size="sm"
                color="success"
                href={cxrRecord.image_result}
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
                  <a href={cxrRecord.image} target="blank">
                    <img src={cxrRecord.image} alt="cxr-img" />
                  </a>
                </div>
              </Carousel>
              <p className="slick-slider__caption-title">Original Image of your CXR</p>
              <Button
                size="sm"
                color="success"
                href={cxrRecord.image}
              >download
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {
        compare !== null
      && (compare.status
        && (
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
        )
      )
      }
      <Row>
        <DoctorNotes />
      </Row>
    </Container>

  );
};

export default CXRResult;
