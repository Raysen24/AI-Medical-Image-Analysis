/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable func-names */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Editor } from '@tinymce/tinymce-react';
import {
  Button, ButtonToolbar, Col, Row,
} from 'reactstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LOCALSTORAGE_TOKEN, LOCALSTORAGE_USERDETAIL } from '../../../../../utils/Types';
import { SOAP_BYMEDICALRECORD_URL, SOAP_URL } from '../../../../../utils/EndPoints';
import SoapListing from './components/soap';

const SOAP = ({ patient }) => {
  const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
  const params = useParams();

  const [soapUser, setSoap] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.get(`${SOAP_BYMEDICALRECORD_URL}${params.id}/`, options)
      .then((res) => {
        setSoap(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const [s, setS] = useState('');
  const handleEditorSChange = (contents) => {
    setS(contents);
  };
  const [o, setO] = useState('');
  const handleEditorOChange = (contents) => {
    setO(contents);
  };
  const [a, setA] = useState('');
  const handleEditorAChange = (contents) => {
    setA(contents);
  };
  const [p, setP] = useState('');
  const handleEditorPChange = (contents) => {
    setP(contents);
  };
  console.log(s, o, a, p);
  const handleSubmit = (e) => {
    e.preventDefault();
    const soap = new FormData();
    soap.append('created_by', userDetail.id);
    soap.append('medical_id', params.id);
    soap.append('patient_id', patient.patient_id);
    if (soapUser.length < 1) {
      soap.append('disease_old', [e.target.disease_old][0].value);
      soap.append('disease_now', [e.target.disease_now][0].value);
      soap.append('complaint', [e.target.complaint][0].value);
    } else {
      soap.append('disease_old', soapUser[0].disease_old);
      soap.append('disease_now', soapUser[0].disease_now);
      soap.append('complaint', soapUser[0].complaint);
    }
    soap.append('room_name', e.target.room_name.value);
    soap.append('subjective', s === '' ? soapUser[soapUser.length - 1].subjective : s);
    soap.append('objective', o === '' ? soapUser[soapUser.length - 1].objective : o);
    soap.append('assessment', a === '' ? soapUser[soapUser.length - 1].assessment : a);
    soap.append('plan', p === '' ? soapUser[soapUser.length - 1].plan : p);
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios.post(SOAP_URL, soap, options)
      .then(() => {
      // history.push({
      //   pathname: '/hospital/patient/list/',
      // });
        // history.goBack();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <SoapListing />
      <hr />
      <form
        className="form form--horizontal"
        onSubmit={handleSubmit}
      >
        {
          soapUser.length < 1
          && (
          <>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Symptoms</span>
              <div className="form__form-group-field">
                <Field
                  name="complaint"
                  component="textarea"
                  type="text"
                  placeholder="Symptoms"
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Previous Diseases</span>
              <div className="form__form-group-field">
                <Field
                  name="disease_old"
                  component="textarea"
                  type="text"
                  placeholder="Previous Diseases"
                />
              </div>
            </div>
            <div className="form__form-group">
              <span className="form__form-group-label bold-text">Current Diseases</span>
              <div className="form__form-group-field">
                <Field
                  name="disease_now"
                  component="textarea"
                  type="text"
                  placeholder="Current Diseases"
                />
              </div>
            </div>
            <hr />
          </>
          )
        }
        <div className="form__form-group">
          <span className="form__form-group-label bold-text">Current Room</span>
          <div className="form__form-group-field">
            <Field
              name="room_name"
              component="input"
              type="text"
              placeholder="Current Room"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label bold-text">S</span>
          <div className="form__form-group-field">
            <Editor
            // onInit={(evt, editor) => (editorRef.current = editor)}
                          // apiKey="yb64t1vjyri2cansglhq8gaz1tai01e0dc0g3jlm9a4cjvdn"
              initialValue={soapUser.length > 0 && soapUser[soapUser.length - 1].subjective}
              apiKey="s1v3xcapuudocok0xo9u4502w4vhr95x55u12id0fc7nbfp2"
              init={{
                skin: 'snow',
                icons: 'thin',
                // placeholder:`${t('dashboard_teacher.create_course.description_message')}`,

                height: 500,
                menubar: true,
                plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen textcolor ', 'insertdatetime media table paste code help wordcount', 'image code'],
                image_title: true,
                automatic_uploads: true,
                file_picker_types: 'image',
                textcolor_rows: '4',
                file_picker_callback(callback, value, meta) {
                  if (meta.filetype === 'image') {
                    const input = document.getElementById('my-file');
                    input.click();
                    input.onchange = function () {
                      const file = input.files[0];
                      const reader = new FileReader();
                      reader.onload = function (e) {
                        callback(e.target.result, {
                          alt: file.name,
                        });
                      };
                      reader.readAsDataURL(file);
                    };
                  }
                },

                content_style: 'body { font-family: Poppins; }',
                font_formats: 'Poppins',

                toolbar: 'undo redo | styleselect | fontselect | fontsizeselect| code | bold italic | alignleft aligncenter alignright alignjustify | outdent indent ',
              }}
              onEditorChange={handleEditorSChange}
              outputFormat="html"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label bold-text">O</span>
          <div className="form__form-group-field">
            <Editor
            // onInit={(evt, editor) => (editorRef.current = editor)}
                          // apiKey="yb64t1vjyri2cansglhq8gaz1tai01e0dc0g3jlm9a4cjvdn"
              initialValue={soapUser.length > 0 && soapUser[soapUser.length - 1].objective}
              apiKey="s1v3xcapuudocok0xo9u4502w4vhr95x55u12id0fc7nbfp2"
              init={{
                skin: 'snow',
                icons: 'thin',
                // placeholder:`${t('dashboard_teacher.create_course.description_message')}`,

                height: 500,
                menubar: true,
                plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen textcolor ', 'insertdatetime media table paste code help wordcount', 'image code'],
                image_title: true,
                automatic_uploads: true,
                file_picker_types: 'image',
                textcolor_rows: '4',
                file_picker_callback(callback, value, meta) {
                  if (meta.filetype === 'image') {
                    const input = document.getElementById('my-file');
                    input.click();
                    input.onchange = function () {
                      const file = input.files[0];
                      const reader = new FileReader();
                      reader.onload = function (e) {
                        callback(e.target.result, {
                          alt: file.name,
                        });
                      };
                      reader.readAsDataURL(file);
                    };
                  }
                },

                content_style: 'body { font-family: Poppins; }',
                font_formats: 'Poppins',

                toolbar: 'undo redo | styleselect | fontselect | fontsizeselect| code | bold italic | alignleft aligncenter alignright alignjustify | outdent indent ',
              }}
              onEditorChange={handleEditorOChange}
              outputFormat="html"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label bold-text">A</span>
          <div className="form__form-group-field">
            <Editor
            // onInit={(evt, editor) => (editorRef.current = editor)}
                          // apiKey="yb64t1vjyri2cansglhq8gaz1tai01e0dc0g3jlm9a4cjvdn"
              initialValue={soapUser.length > 0 && soapUser[soapUser.length - 1].assessment}
              apiKey="s1v3xcapuudocok0xo9u4502w4vhr95x55u12id0fc7nbfp2"
              init={{
                skin: 'snow',
                icons: 'thin',
                // placeholder:`${t('dashboard_teacher.create_course.description_message')}`,

                height: 500,
                menubar: true,
                plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen textcolor ', 'insertdatetime media table paste code help wordcount', 'image code'],
                image_title: true,
                automatic_uploads: true,
                file_picker_types: 'image',
                textcolor_rows: '4',
                file_picker_callback(callback, value, meta) {
                  if (meta.filetype === 'image') {
                    const input = document.getElementById('my-file');
                    input.click();
                    input.onchange = function () {
                      const file = input.files[0];
                      const reader = new FileReader();
                      reader.onload = function (e) {
                        callback(e.target.result, {
                          alt: file.name,
                        });
                      };
                      reader.readAsDataURL(file);
                    };
                  }
                },

                content_style: 'body { font-family: Poppins; }',
                font_formats: 'Poppins',

                toolbar: 'undo redo | styleselect | fontselect | fontsizeselect| code | bold italic | alignleft aligncenter alignright alignjustify | outdent indent ',
              }}
              onEditorChange={handleEditorAChange}
              outputFormat="html"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label bold-text">P</span>
          <div className="form__form-group-field">
            <Editor
            // onInit={(evt, editor) => (editorRef.current = editor)}
                          // apiKey="yb64t1vjyri2cansglhq8gaz1tai01e0dc0g3jlm9a4cjvdn"
              apiKey="s1v3xcapuudocok0xo9u4502w4vhr95x55u12id0fc7nbfp2"
              initialValue={soapUser.length > 0 && soapUser[soapUser.length - 1].plan}
              init={{
                skin: 'snow',
                icons: 'thin',
                // placeholder:`${t('dashboard_teacher.create_course.description_message')}`,

                height: 500,
                menubar: true,
                plugins: ['advlist autolink lists link image charmap print preview anchor', 'searchreplace visualblocks code fullscreen textcolor ', 'insertdatetime media table paste code help wordcount', 'image code'],
                image_title: true,
                automatic_uploads: true,
                file_picker_types: 'image',
                textcolor_rows: '4',
                file_picker_callback(callback, value, meta) {
                  if (meta.filetype === 'image') {
                    const input = document.getElementById('my-file');
                    input.click();
                    input.onchange = function () {
                      const file = input.files[0];
                      const reader = new FileReader();
                      reader.onload = function (e) {
                        callback(e.target.result, {
                          alt: file.name,
                        });
                      };
                      reader.readAsDataURL(file);
                    };
                  }
                },

                content_style: 'body { font-family: Poppins; }',
                font_formats: 'Poppins',

                toolbar: 'undo redo | styleselect | fontselect | fontsizeselect| code | bold italic | alignleft aligncenter alignright alignjustify | outdent indent ',
              }}
              onEditorChange={handleEditorPChange}
              outputFormat="html"
            />
          </div>
        </div>
        <ButtonToolbar className="form__button-toolbar">
          <Row className="mt-4">
            <Col md={12}>
              <Button type="submit" className="btn btn-primary">
                Submit
              </Button>
            </Col>
          </Row>
        </ButtonToolbar>
      </form>
    </>
  );
};
export default reduxForm({
  form: 'soap_form', // a unique identifier for this form
})(SOAP);
