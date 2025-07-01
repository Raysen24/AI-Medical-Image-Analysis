/* eslint-disable no-shadow */
/* eslint-disable no-console */
import React from 'react';
import {
  Container, ButtonToolbar, Button,
} from 'reactstrap';
// import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import FileDocumentNurse from './components/FileUploadBloodTesNursetForm';

const BloodTestFileUploadNurse = () => {
  const history = useHistory();

  return (

    <Container className="dashboard">
      <ButtonToolbar className="form__button-toolbar ">
        <Button color="primary" onClick={history.goBack}>
          Back
        </Button>
      </ButtonToolbar>
      <FileDocumentNurse />
    </Container>
  );
};

export default BloodTestFileUploadNurse;
