/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import {
  Card, CardBody, Col, ButtonToolbar, Button,
} from 'reactstrap';
import { LOCALSTORAGE_USERDETAIL } from '../../../../../../../utils/Types';
import renderSelectField from '../../../../../../../shared/components/form/Select';

const ManualInputBloodTestForm = ({ handleSubmit }) => {
  const [hospital, setHospital] = useState([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);

  const hospitalList = hospitalLoading && hospital
    ? hospitalLoading && hospital.map((e) => ({
      value: `${e.id}`, label: `${e.name}`,
    })) : [];

  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    setHospital(userDetail.hospital_list);
    setHospitalLoading(true);
  }, []);

  const [category, setCategory] = useState('Antigen Swab');

  return (
    <Col xs={12} md={12} lg={12} xl={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="card__title">
            <h5 className="bold-text">PCR/SWAB ANTIGEN</h5>
            <h5 className="subhead">Input your pcr/swab data</h5>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form__form-group">
              <span className="form__form-group-label">Hospital</span>
              <div className="form__form-group-field">
                <Field
                  name="hospital_id"
                  component={renderSelectField}
                  type="text"
                  placeholder="Please select an option"
                  options={hospitalList || [
                    { value: 'one', label: 'Not Found' },
                  ]}
                  required
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label">Category</span>
              <div className="form__form-group-field">
                <Field
                  name="category"
                  component={renderSelectField}
                  type="text"
                  placeholder="Please select an option"
                  value={category}
                  options={[
                    { value: 'Antigen Swab', label: 'Antigen Swab' },
                    { value: 'PCR', label: 'PCR' },
                  ]}
                  onChange={(e) => {
                    setCategory(e.value);
                  }}
                  required
                />
              </div>
            </div>
            {category === 'Antigen Swab'
              ? (
                <>
                  <div className="form__half">
                    <div className="form__form-group">
                      <span className="form__form-group-label">Date swab</span>
                      <div className="form__form-group-field">
                        <Field
                          name="date_swab"
                          component="input"
                          type="date"
                          placeholder="xx.xx"
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Parameter Swab</span>
                      <div className="form__form-group-field">
                        <Field
                          name="parameter_swab"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Swab Antigen Test SARS-CoV2', label: 'Swab Antigen Test SARS-CoV2' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form__half">
                    <div className="form__form-group">
                      <span className="form__form-group-label">Metode Swab</span>
                      <div className="form__form-group-field">
                        <Field
                          name="metode_swab"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Nasofaring', label: 'Nasofaring' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Result Swab</span>
                      <div className="form__form-group-field">
                        <Field
                          name="result_swab"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Positive', label: 'Positive' },
                            { value: 'Negative', label: 'Negative' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="form__form-group">
                    <span className="form__form-group-label">Date PCR</span>
                    <div className="form__form-group-field">
                      <Field
                        name="date_pcr"
                        component="input"
                        type="date"
                        placeholder="xx.xx"
                      />
                    </div>
                  </div>
                  {/* Parameter */}
                  <Col md={12} lg={3}>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Parameter 1 PCR</span>
                      <div className="form__form-group-field">
                        <Field
                          name="parameter_1_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'SARS-CoV2 Nucleic Acid Test (RT-PCR)', label: 'SARS-CoV2 Nucleic Acid Test (RT-PCR)' },
                            { value: 'CT value N gene', label: 'CT value N gene' },
                            { value: 'CT value ORF1ab', label: 'CT value ORF1ab' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Parameter 2 PCR</span>
                      <div className="form__form-group-field">
                        <Field
                          name="parameter_2_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'SARS-CoV2 Nucleic Acid Test (RT-PCR)', label: 'SARS-CoV2 Nucleic Acid Test (RT-PCR)' },
                            { value: 'CT value N gene', label: 'CT value N gene' },
                            { value: 'CT value ORF1ab', label: 'CT value ORF1ab' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Parameter 3 PCR</span>
                      <div className="form__form-group-field">
                        <Field
                          name="parameter_3_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'SARS-CoV2 Nucleic Acid Test (RT-PCR)', label: 'SARS-CoV2 Nucleic Acid Test (RT-PCR)' },
                            { value: 'CT value N gene', label: 'CT value N gene' },
                            { value: 'CT value ORF1ab', label: 'CT value ORF1ab' },
                          ]}
                          required
                        />
                      </div>
                    </div>

                  </Col>
                  {/* Metode */}
                  <Col md={12} lg={3}>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Metode 1 PCR</span>
                      <div className="form__form-group-field">
                        <Field
                          name="metode_1_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Polymerase Chain Reaction', label: 'Polymerase Chain Reaction' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Metode 2 PCR</span>
                      <div className="form__form-group-field">
                        <Field
                          name="metode_2_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Polymerase Chain Reaction', label: 'Polymerase Chain Reaction' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Metode 3 PCR</span>
                      <div className="form__form-group-field">
                        <Field
                          name="metode_3_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Polymerase Chain Reaction', label: 'Polymerase Chain Reaction' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                  </Col>
                  {/* Normal */}
                  <Col md={12} lg={3}>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Normal 1 Range</span>
                      <div className="form__form-group-field">
                        <Field
                          name="normal_range_1_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Negative', label: 'Negative' },
                            { value: 'Undetection/CT > 38', label: 'Undetection/CT > 38' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Normal 2 Range</span>
                      <div className="form__form-group-field">
                        <Field
                          name="normal_range_2_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Negative', label: 'Negative' },
                            { value: 'Undetection/CT > 38', label: 'Undetection/CT > 38' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Normal 3 Range</span>
                      <div className="form__form-group-field">
                        <Field
                          name="normal_range_3_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Negative', label: 'Negative' },
                            { value: 'Undetection/CT > 38', label: 'Undetection/CT > 38' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                  </Col>
                  {/* Result */}
                  <Col md={12} lg={3}>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Result 1 PCR</span>
                      <div className="form__form-group-field">
                        <Field
                          name="result_1_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Positive', label: 'Positive' },
                            { value: 'Negative', label: 'Negative' },
                            { value: 'Not Detection', label: 'Not Detection' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Result 2 PCR</span>
                      <div className="form__form-group-field">
                        <Field
                          name="result_2_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Positive', label: 'Positive' },
                            { value: 'Negative', label: 'Negative' },
                            { value: 'Not Detection', label: 'Not Detection' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                    <div className="form__form-group">
                      <span className="form__form-group-label">Result 3 PCR</span>
                      <div className="form__form-group-field">
                        <Field
                          name="result_3_pcr"
                          component={renderSelectField}
                          type="text"
                          placeholder="Please select an option"
                          options={[
                            { value: 'Positive', label: 'Positive' },
                            { value: 'Negative', label: 'Negative' },
                            { value: 'Not Detection', label: 'Not Detection' },
                          ]}
                          required
                        />
                      </div>
                    </div>
                  </Col>
                </>
              )}

            <ButtonToolbar className="form__button-toolbar">
              <Button
                color="primary"
                type="submit"
                // disabled={!selectedStudent}
              >
                Submit
              </Button>
            </ButtonToolbar>
          </form>
        </CardBody>
      </Card>
    </Col>
  );
};

ManualInputBloodTestForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'blood_testmanual_form', // a unique identifier for this form
})(ManualInputBloodTestForm);
