/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable react/prop-types */
/* eslint-disable func-names */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import { LOCALSTORAGE_TOKEN } from '../../../../../../utils/Types';
import { SOAP_BYMEDICALRECORD_URL } from '../../../../../../utils/EndPoints';

const SoapListing = () => {
  const params = useParams();

  const [soap, setSoap] = useState([]);
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
  console.log(soap);
  return (
    <form
      className="form form--horizontal"
    >
      {
        soap.length > 0
      && (
      <>
        <div className="form__half">
          <div className="form__form-group">
            <span className="form__form-group-label bold-text">{soap[0].created_by_detail.role}</span>
            <div className="form__form-group-field">
              <div>
                {soap[0].created_by_detail.fullname}
              </div>
            </div>
          </div>
        </div>
        <div className="form__half">
          <div className="form__form-group">
            <span className="form__form-group-label bold-text">Date</span>
            <div className="form__form-group-field">
              <div>
                {soap[0].created_at}
              </div>
            </div>
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label bold-text">Symptoms</span>
          <div className="form__form-group-field">
            <div>
              {soap.length > 0 && soap[0].complaint}
            </div>
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label bold-text">Previous Diseases</span>
          <div className="form__form-group-field">
            <div>
              {soap.length > 0 && soap[0].disease_old}
            </div>
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label bold-text">Current Diseases</span>
          <div className="form__form-group-field">
            <div>{soap.length > 0 && soap[0].disease_now}</div>
          </div>
        </div>
      </>
      )
      }
      {
        soap.length > 0 && soap.map((e) => (
          <>
            <div className="form__half">
              <div className="form__form-group">
                <span className="form__form-group-label bold-text">{e.created_by_detail.role}</span>
                <div className="form__form-group-field">
                  <div>
                    {e.created_by_detail.fullname}
                  </div>
                </div>
              </div>
            </div>
            <div className="form__half">
              <div className="form__form-group">
                <span className="form__form-group-label bold-text">Date</span>
                <div className="form__form-group-field">
                  <div>
                    {e.created_at}
                  </div>
                </div>
              </div>
              <div className="form__form-group">
                <span className="form__form-group-label bold-text">Room</span>
                <div className="form__form-group-field">
                  <div>
                    {e.room_name}
                  </div>
                </div>
              </div>
            </div>
            <div key={e.id} className="form__form-group">
              <span className="form__form-group-label bold-text">S</span>
              <div style={{ 'border-style': 'solid' }} className="form__form-group-field">
                <div>
                  {ReactHtmlParser(e.subjective)}
                </div>
              </div>
            </div>
            <hr />
            <div key={e.id} className="form__form-group">
              <span className="form__form-group-label bold-text">O</span>
              <div style={{ 'border-style': 'solid' }} className="form__form-group-field">
                <div>
                  {ReactHtmlParser(e.objective)}
                </div>
              </div>
            </div>
            <div key={e.id} className="form__form-group">
              <span className="form__form-group-label bold-text">A</span>
              <div style={{ 'border-style': 'solid' }} className="form__form-group-field">
                <div>
                  {ReactHtmlParser(e.assessment)}
                </div>
              </div>
            </div>
            <div key={e.id} className="form__form-group">
              <span className="form__form-group-label bold-text">P</span>
              <div style={{ 'border-style': 'solid' }} className="form__form-group-field">
                <div>
                  {ReactHtmlParser(e.plan)}
                </div>
              </div>
            </div>
            <hr />
          </>
        ))
      }
    </form>
  );
};
export default (SoapListing);
