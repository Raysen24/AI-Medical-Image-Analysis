/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import {
  ButtonToolbar, Col, Card, CardBody, Row,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import axios from 'axios';
import renderSelectField from '../../../../shared/components/form/Select';
import renderFileInputField from '../../../../shared/components/form/FileInput';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../utils/Types';
import {
  CXR_MEDICALRECORD, CTSCAN_MEDICALRECORD, BLOODTEST_MEDICALRECORD,
} from '../../../../utils/EndPoints';

const ProductEditForm = ({ dataUser, handleSubmit }) => {
  const [isEditable, setEditable] = useState(false);
  const [userLogin, setUserLogin] = useState('No Name');
  const [loading, setLoading] = useState(false);

  const [cxrLastUpdate, setcxrLastUpdate] = useState([]);
  const [ctscanLastUpdate, setctscanLastUpdate] = useState([]);
  const [bloodtestLastUpdate, setbloodtestLastUpdate] = useState([]);
  useEffect(() => {
    const userdetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    setUserLogin(userdetail);
    setLoading(true);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios
      .get(CXR_MEDICALRECORD, options)
      .then((res) => {
        setcxrLastUpdate(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(CTSCAN_MEDICALRECORD, options)
      .then((res) => {
        setctscanLastUpdate(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get(BLOODTEST_MEDICALRECORD, options)
      .then((res) => {
        setbloodtestLastUpdate(res.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // console.log('cxr', cxrLastUpdate[0].pneumonia);
  return (
    <Col md={12} lg={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <form className="form product-edit" onSubmit={handleSubmit}>
            <div className="form__half">
              <div className="form__form-group-id-category">
                {/* <div className="form__form-group form__form-group-id">
                  <span className="form__form-group-label bold-text">MR ID</span>
                  <div className="form__form-group-field">
                    <Field
                      name="mr_id_patient"
                      component="input"
                      type="text"
                      disabled
                    />
                  </div>
                </div> */}
                <div className="form__form-group">
                  <span className="form__form-group-label bold-text">Your Name</span>
                  <div className="form__form-group-field">
                    <Field name="fullname" component="input" type="text" disabled={!isEditable} />
                  </div>
                </div>
              </div>
              {/* <div className="form__form-group-id-category">
                <div className="form__form-group form__form-group-id">
                  <span className="form__form-group-label">Room</span>
                  <div className="form__form-group-field">
                    <Field
                      name="id"
                      component="input"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Assigned Doctor</span>
                  <div className="form__form-group-field">
                    <Field
                      name="name"
                      component="input"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
              </div> */}
              <div className="form__form-group-id-category">
                <div className="form__form-group form__form-group-id">
                  <span className="form__form-group-label">Date of Birth</span>
                  <div className="form__form-group-field">
                    <Field name="dob" component="input" type="date" disabled={!isEditable} />
                  </div>
                </div>
                <div className="form__form-group">
                  <span className="form__form-group-label">Sex</span>
                  <div className="form__form-group-field">
                    <Field name="sex" component="input" type="text" disabled />
                  </div>
                  {isEditable ? (
                    <div className="form__form-group-field">
                      <Field
                        name="sex_edit"
                        component={renderSelectField}
                        type="text"
                        options={[
                          { value: 'Female', label: 'Female' },
                          { value: 'Male', label: 'Male' },
                        ]}
                        placeholder="Select One"
                        disabled={!isEditable}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              {isEditable ? (
                <div className="form__form-group-id-category">
                  <div className="form__form-group form__form-group-id">
                    <span className="form__form-group-label">Phone Number</span>
                    <div className="form__form-group-field">
                      <Field name="phone" component="input" type="number" disabled={!isEditable} />
                    </div>
                  </div>
                  <div className="form__form-group">
                    <span className="form__form-group-label">Email</span>
                    <div className="form__form-group-field">
                      <Field name="email" component="input" type="email" disabled={!isEditable} />
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
              <div className="form__form-group">
                <span className="form__form-group-label">Address</span>
                <div className="form__form-group-field">
                  <Field name="address" component="textarea" type="text" disabled={!isEditable} />
                </div>
              </div>
              {/* {dataUser.role === 'Patient' && (
                <>
                  <div className="card__title">
                    <h5 className="bold-text">AI Based Patient Status</h5>
                  </div>
                  <div className="form form--horizontal">
                    <div className="form__form-group">
                      <span className="form__form-group-label">Blood Status</span>
                      <div className="form__form-group-field">
                        <Field
                          name="brand"
                          component="input"
                          type="text"
                          disabled
                          placeholder={loading && bloodtestLastUpdate.length > 0 ? `Probapredict ${bloodtestLastUpdate[0].probapredict} || Classpredict ${bloodtestLastUpdate[0].classpredict}` : ''}
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">CT-Scan Status</span>
                      <div className="form__form-group-field">
                        <Field
                          name="general_category"
                          component="input"
                          type="text"
                          disabled
                          placeholder={loading && ctscanLastUpdate.length > 0 ? `Diagnosis ${ctscanLastUpdate[0].diagnosis} || Cofidence ${ctscanLastUpdate[0].confidence}` : ''}
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">CXR Status</span>
                      <div className="form__form-group-field">
                        <Field
                          name="delivery"
                          component="input"
                          type="text"
                          disabled
                          placeholder={loading && cxrLastUpdate.length > 0 ? `Pneumonia ${cxrLastUpdate[0].pneumonia} || Covid19 ${cxrLastUpdate[0].covid} || Normal ${cxrLastUpdate[0].normal}` : ''}
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">PCR Status</span>
                      <div className="form__form-group-field">
                        <Field name="weight" component="input" type="text" disabled placeholder="Positive/Negative (dd/mm/yyyy)" />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Antigen Swab Status</span>
                      <div className="form__form-group-field">
                        <Field name="size" component="input" type="text" disabled placeholder="Positive/Negative (dd/mm/yyyy)" />
                      </div>
                    </div>
                  </div>
                </>
              )} */}
            </div>
            <div className="form__half">
              <div className="form__form-group">
                <span className="form__form-group-label">Photo Profile</span>
                <div className="form__form-group-field">{isEditable ? <Field name="photo" component={renderFileInputField} disabled={!isEditable} /> : ''}</div>
                <a href={userLogin.photo} target="blank">
                  {userLogin.photo}
                </a>
              </div>
            </div>
            <ButtonToolbar className="form__button-toolbar">
              <Row className="mt-4">
                <Col md={12}>
                  <button type="button" className="btn btn-warning" onClick={() => setEditable(!isEditable)}>
                    {' '}
                    {!isEditable ? 'Edit' : 'Cancel'}
                  </button>
                  {isEditable && (
                    <button type="submit" className="btn btn-primary">
                      {' '}
                      Update
                    </button>
                  )}
                  {/* {isEditable === false && (
                  <button
                    type="button"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
                      const options = {
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Token ${token}`,
                        },
                      };
                      axios.delete(`${MEDICALRECORD}/${params.id}/`, options)
                        .then(() => {
                          history.push({
                            pathname: '/dashboard/user',
                          });
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }}
                    className="btn btn-danger"
                  > Delete
                  </button>
                  )} */}
                </Col>
              </Row>
            </ButtonToolbar>
          </form>
        </CardBody>
      </Card>
    </Col>
  );
};

ProductEditForm.propTypes = {
  dataUser: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'product_edit_form', // a unique identifier for this form
})(ProductEditForm);
