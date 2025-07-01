/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Card, CardBody, Col, Container, Row,
} from 'reactstrap';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';
import AccountInformation from './components/AccountInformation';
import { LOCALSTORAGE_USERDETAIL, LOCALSTORAGE_TOKEN } from '../../../utils/Types';
import { AUTH_URL_USERME } from '../../../utils/EndPoints';
import ProfileAccount from './components/ProfileAccount';

const Profile = () => {
  const [roleUser, setRoleUser] = useState([]);
  const [userId, setUserId] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  // const [userId1, setUserId1] = useState([]);
  useEffect(() => {
    const userDetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    setRoleUser(userDetail.role);
    setUserId(userDetail);
    setLoadingUser(true);
    // setUserId1(userDetail);
  });

  // const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const onSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append('fullname', [e.target.fullname][0].value);
    updatedData.append('email', [e.target.email][0].value);
    updatedData.append('dob', [e.target.dob][0].value);
    updatedData.append('sex', [e.target.sex_edit][0].value);
    updatedData.append('address', [e.target.address][0].value);
    updatedData.append('phone', [e.target.phone][0].value);
    if ([e.target.photo][0].files[0]) {
      updatedData.append('photo', [e.target.photo][0].files[0]);
    }

    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    axios
      .patch(AUTH_URL_USERME, updatedData, options)
      .then((userData) => {
        // window.location.reload();
        localStorage.setItem(LOCALSTORAGE_USERDETAIL, JSON.stringify(userData.data));
        // history.push()
        window.location.reload();
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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
    <Container className="dashboard">
      <div className="profile">
        <Row>
          <Col md={12} lg={12} xl={12}>
            <Card>
              <CardBody className="dashboard__booking-card">
                <ProfileAccount />
              </CardBody>
            </Card>
          </Col>
          <Col md={12} lg={12} xl={12}>
            <Row>
              {loadingUser && roleUser
                && (
                <AccountInformation
                  initialValues={loadingUser && userId}
                  dataUser={loadingUser && userId}
                  handleSubmit={(e) => onSubmit(e)}
                />
                )}
            </Row>

          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Profile;
