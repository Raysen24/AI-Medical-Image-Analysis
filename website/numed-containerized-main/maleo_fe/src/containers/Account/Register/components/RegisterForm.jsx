/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import EyeIcon from 'mdi-react/EyeIcon';
import { useHistory } from 'react-router-dom';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import AlternateEmailIcon from 'mdi-react/AlternateEmailIcon';
import CalendarBlankIcon from 'mdi-react/CalendarBlankIcon';
import CallIcon from 'mdi-react/CallIcon';
import { Button } from 'reactstrap';
import axios from 'axios';
import renderSelectField from '../../../../shared/components/form/Select';
import { PROVINCE, USERS_MANAGEMENT, ACTIVE_HOSPITAL } from '../../../../utils/EndPoints';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  // const [isVisibleAlert, setVisibleAlert] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [hospital, setHospital] = useState([]);
  const [hospitalLoading, setHospitalLoading] = useState(false);
  const toggleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };
  const [province, setProvince] = useState([]);
  const [regency, setRegency] = useState([]);
  const [district, setDistrict] = useState([]);
  const [subDistrict, setSubDistrict] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedRegency, setSelectedRegency] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState(null);

  const provinceList = province
    ? province.map((e) => ({
      value: `${e.unique_id}`, label: `${e.name}`,
    })) : [];

  const regencyList = regency
    ? regency.map((e) => ({
      value: `${e.unique_id}`, label: `${e.name}`,
    })) : [];

  const districtList = district
    ? district.map((e) => ({
      value: `${e.unique_id}`, label: `${e.name}`,
    })) : [];

  const subDistrictList = subDistrict
    ? subDistrict.map((e) => ({
      value: `${e.unique_id}`, label: `${e.name}`,
    })) : [];
  const hospitalList = hospitalLoading && hospital
    ? hospitalLoading && hospital.map((e) => ({
      value: `${e.id}`, label: `${e.name}`,
    })) : [];
  useEffect(() => {
    axios.get(PROVINCE)
      .then((res) => {
        setProvince(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    axios.get(ACTIVE_HOSPITAL)
      .then((res) => {
        console.log('sas', res.data);
        setHospital(res.data);
        setHospitalLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // submit data
  // const errorHandling = () => {
  //   setLoading(false);
  //   setVisibleAlert(true);
  //   setTimeout(() => {
  //     setVisibleAlert(false);
  //   }, 5000);
  // };
  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append('fullname', [e.target.fullname][0].value);
    data.append('email', [e.target.email][0].value);
    data.append('dob', [e.target.dob][0].value);
    data.append('sex', [e.target.sex][0].value);
    data.append('province', selectedProvince);
    data.append('regency', selectedRegency);
    data.append('district', selectedDistrict);
    data.append('subdistrict', selectedSubdistrict);
    data.append('address', [e.target.address][0].value);
    data.append('phone', [e.target.phone][0].value);
    data.append('hospital', [e.target.hospital][0].value);
    data.append('role', [e.target.role][0].value);
    // data.append('role', 'Patient');
    data.append('password', [e.target.password][0].value);
    data.append('password2', [e.target.password2][0].value);

    axios.post(USERS_MANAGEMENT, data)
      .then(() => {
        // window.location.reload();
        history.push({
          pathname: '/log_in',
          // state: { data: listingAttendance },
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        // errorHandling(err.response.data);
        setLoading(false);
      });
  };

  if (isLoading) {
    return (
      <div className="load">
        <div className="load__icon-wrap">
          <svg className="load__icon">
            <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      {/* <Alert
        color="danger"
        isOpen={!!errorMessage}
      >
        {errorMessage}
      </Alert> */}
      <div className="form__half">
        <div className="form__form-group">
          <span className="form__form-group-label">Full Name</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AccountOutlineIcon />
            </div>
            <Field
              name="fullname"
              component="input"
              type="text"
              placeholder="your full name"
              className="input-without-border-radius"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">E-mail</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AlternateEmailIcon />
            </div>
            <Field
              name="email"
              component="input"
              type="email"
              placeholder="example@mail.com"
              required
              className="input-without-border-radius"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Role</span>
          <div className="form__form-group-field">
            <Field
              name="role"
              component={renderSelectField}
              options={[
                { value: 'Patient', label: 'Patient' },
                { value: 'Doctor', label: 'Doctor' },
                { value: 'Nurse', label: 'Nurse' },
                { value: 'Hospital Admin', label: 'Hospital Admin' },
                { value: 'Hospital Management', label: 'Hospital Management' },
              ]}
              placeholder="Choose one"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Date of Birth</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <CalendarBlankIcon />
            </div>
            <Field
              name="dob"
              component="input"
              type="date"
              placeholder="date of birth"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Gender</span>
          <div className="form__form-group-field">
            <Field
              name="sex"
              component={renderSelectField}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
              ]}
              placeholder="Choose one"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Phone Number</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              {/* <AlternateEmailIcon /> */}
              <CallIcon />
            </div>
            <Field
              name="phone"
              component="input"
              type="tel"
              placeholder="08xxxxxxxx"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Hospital</span>
          <div className="form__form-group-field">
            <Field
              name="hospital"
              component={renderSelectField}
              placeholder="Choose one"
              options={hospitalList || [
                { value: '-', label: '-' },
              ]}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Province</span>
          <div className="form__form-group-field">
            <Field
              name="province"
              component={renderSelectField}
              placeholder="Choose one"
              options={provinceList || [
                { value: '-', label: '-' },
              ]}
              onChange={(e) => {
                setSelectedProvince(e.label);
                axios.get(`${PROVINCE}${e.value}/regency/`)
                  .then((res) => {
                    setRegency(res.data);
                  }).catch((err) => {
                    console.log('ERROR', err.response.data);
                  });
              }}
            />
          </div>
        </div>
      </div>
      <div className="form__half">
        <div className="form__form-group">
          <span className="form__form-group-label">Regency/City</span>
          <div className="form__form-group-field">
            <Field
              name="regency"
              component={renderSelectField}
              placeholder="Choose one"
              options={regencyList || [
                { value: '-', label: '-' },
              ]}
              onChange={(e) => {
                setSelectedRegency(e.label);
                axios.get(`${PROVINCE}regency/${e.value}/district/`)
                  .then((res) => {
                    setDistrict(res.data);
                  }).catch((err) => {
                    console.log('ERROR', err.response.data);
                  });
              }}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">District</span>
          <div className="form__form-group-field">
            <Field
              name="district"
              component={renderSelectField}
              placeholder="Choose one"
              options={districtList || [
                { value: '-', label: '-' },
              ]}
              onChange={(e) => {
                setSelectedDistrict(e.label);
                axios.get(`${PROVINCE}regency/district/${e.value}/subdistrict/`)
                  .then((res) => {
                    setSubDistrict(res.data);
                  }).catch((err) => {
                    console.log('ERROR', err.response.data);
                  });
              }}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Sub District</span>
          <div className="form__form-group-field">
            <Field
              name="subdistrict"
              component={renderSelectField}
              placeholder="Choose one"
              options={subDistrictList || [
                { value: '-', label: '-' },
              ]}
              onChange={(e) => {
                setSelectedSubdistrict(e.label);
              }}
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Address</span>
          <div className="form__form-group-field">
            <Field
              name="address"
              component="textarea"
              type="text"
              placeholder="your address"
            />
          </div>
        </div>
        <div className="form__form-group form__form-group--forgot">
          <span className="form__form-group-label">Password</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="password"
              component="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              className="input-without-border-radius"
            />
            <button
              type="button"
              className={`form__form-group-button${showPassword ? ' active' : ''}`}
              onClick={toggleShowPassword}
            ><EyeIcon />
            </button>
          </div>
        </div>
        <div className="form__form-group form__form-group--forgot">
          <span className="form__form-group-label">Confirm Password</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <Field
              name="password2"
              component="input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              className="input-without-border-radius"
            />
            <button
              type="button"
              className={`form__form-group-button${showPassword ? ' active' : ''}`}
              onClick={toggleShowPassword}
            ><EyeIcon />
            </button>
          </div>
        </div>
      </div>

      {/* {isVisibleAlert ? (
        <Alert visible={isVisibleAlert} color="danger">
          <p><span className="bold-text">Register Failed</span></p>
        </Alert>
      )
        : ''} */}
      <div className="account__btns register__btns">
        <Button type="submit" color="primary" className="account__btn">
          Sign Up
        </Button>
      </div>
    </form>
  );
};

// RegisterForm.propTypes = {
//   handleSubmit: PropTypes.func.isRequired,
//   errorMessage: PropTypes.string,
// };

// RegisterForm.defaultProps = {
//   errorMessage: '',
// };

export default reduxForm({
  form: 'register_form',
})(RegisterForm);
