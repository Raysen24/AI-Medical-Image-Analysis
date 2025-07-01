/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, Col,
} from 'reactstrap';
import { LOCALSTORAGE_USERDETAIL } from '../../../../utils/Types';

const Ava = `${process.env.PUBLIC_URL}/img/no_image.png`;

const ProfileAccount = () => {
  const [myUser, setMyUser] = useState(null);
  // console.log('my user', myUser);
  useEffect(() => {
    const localdata = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    setMyUser(localdata);
  }, []);
  return (

    <Col md={12} lg={12} xl={12}>
      <Card>
        <CardBody className="dashboard__booking-card">
          <div className="profile__information">
            <div className="profile__avatar">
              <img src={myUser ? myUser.photo : Ava} alt="avatar" />
            </div>
            <div className="profile__data">
              <p className="profile__name">{myUser ? myUser.fullname : 'No Available Name'}</p>
              <p className="profile__work">{myUser ? myUser.role : 'No Available Role'}</p>
              <p className="profile__contact">{myUser ? myUser.email : 'Email not registered'}</p>
              <p className="profile__contact">{myUser ? myUser.hospital_list[0].name : 'Hospital not registered'}</p>
              <p className="profile__contact" dir="ltr">{myUser ? myUser.phone : 'Phone not registered'}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ProfileAccount;
