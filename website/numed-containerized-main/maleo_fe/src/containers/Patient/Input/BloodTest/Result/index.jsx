/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Col, Container, Row, Card, CardBody, ButtonToolbar, Button,
} from 'reactstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory, Link } from 'react-router-dom';
import { LOCALSTORAGE_TOKEN } from '../../../../../utils/Types';
import { BLOODTEST_MEDICALRECORD } from '../../../../../utils/EndPoints';
import ResultBloodTest from './components/ResultBloodTest';

import Ava2 from '../../../../../shared/img/assets/bloodtest_confidence.png';
import Ava1 from '../../../../../shared/img/assets/bloodtest_outcome.png';

const BloodTestResult = () => {
  const { t } = useTranslation('common');
  const params = useParams();
  const [bloodtestRecord, setbloodtestRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(`${BLOODTEST_MEDICALRECORD}${params.id}/`, options)
      .then((res) => {
        setbloodtestRecord(res.data);
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
          <Link className="btn btn-primary products-list__btn-add" to="/input/bloodtest/manual">
            {t('ui.btn.new')}
          </Link>
          <Link className="btn btn-primary products-list__btn-add" to="/input/bloodtest/upload">
            Upload
          </Link>
        </ButtonToolbar>
      </div>
      <Row>
        <Col md={12}>
          <Card>
            <CardBody className="dashboard__title-card">
              <div>
                <div className="dashboard__title-card">
                  <div className="product-card__info">
                    <h1 className="product-card__title">{t('patient.input.blood.here')} <span className="red-text"> {t('patient.input.blood.based')}</span></h1>
                    <h3 className="page-subhead subhead">{t('ui.info.upload_on')} {loading ? bloodtestRecord.created_at : ''}
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
                  {loading && bloodtestRecord.classpredict === 1.00 ? 'Positive' : 'Negative'}
                </h5>
                <div className="dashboard__competitor-img">
                  <img src={Ava1} alt="" />
                </div>
              </div>
              <h5 className="dashboard__booking-total-description">Prediction</h5>
            </CardBody>
          </Card>
        </Col>
        <Col md={12} xl={6} lg={6} xs={12}>
          <Card>
            <CardBody className="dashboard__booking-card">
              <div className="dashboard__booking-total-container">
                <h5 className="dashboard__booking-total-title dashboard__booking-total-title--red">
                  {loading ? bloodtestRecord.probapredict.toFixed(2) : ''}
                </h5>
                <div className="dashboard__competitor-img">
                  <img src={Ava2} alt="" />
                </div>
              </div>
              <h5 className="dashboard__booking-total-description">Probability</h5>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <ResultBloodTest />
      </Row>
    </Container>
  );
};

export default BloodTestResult;
