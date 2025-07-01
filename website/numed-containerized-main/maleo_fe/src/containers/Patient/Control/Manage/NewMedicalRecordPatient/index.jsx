import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container, Row, ButtonToolbar, Button,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import MedicalRecordForm from './components/MedicalRecordForm';

const NewMedicalRecordPatient = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  return (
    <Container className="dashboard">
      <ButtonToolbar className="form__button-toolbar">
        <Button color="primary" onClick={history.goBack}>
          {t('ui.btn.back')}
        </Button>
      </ButtonToolbar>
      <Row>
        <MedicalRecordForm />
      </Row>
    </Container>
  );
};

export default (NewMedicalRecordPatient);
