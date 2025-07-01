/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import DownIcon from 'mdi-react/ChevronDownIcon';
import { Collapse } from 'reactstrap';
import { useHistory, Link } from 'react-router-dom';
import TopbarMenuLink from './TopbarMenuLink';
import { LOCALSTORAGE_USERDETAIL } from '../../../utils/Types';

const Ava = `${process.env.PUBLIC_URL}/img/ava.png`;
const TopbarProfile = () => {
  const history = useHistory();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userLogin, setUserLogin] = useState('No Name');
  const [loading, setLoading] = useState(false);
  // console.log('userLogin', userLogin);
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  useEffect(() => {
    const userdetail = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    setUserLogin(userdetail);
    setLoading(true);
  }, []);
  return (
    <div className="topbar__profile">
      <button type="button" className="topbar__avatar" onClick={setIsCollapsed}>
        <img
          className="topbar__avatar-img"
          src={loading ? userLogin.photo : Ava}
          alt="avatar"
        />
        <p className="topbar__avatar-name">{userLogin.fullname}</p>
        <DownIcon className="topbar__icon" />
      </button>
      {isCollapsed && (
        <button
          type="button"
          aria-label="button collapse"
          className="topbar__back"
          onClick={handleToggleCollapse}
        />
      )}
      <Collapse isOpen={isCollapsed} className="topbar__menu-wrap">
        <div className="topbar__menu">
          <TopbarMenuLink title="My Account" icon="list" path="/account/index/" />
          <div className="topbar__menu-divider" />
          <Link
            className="topbar__link"
            to="#"
            onClick={() => {
              localStorage.clear();
              history.push(
                {
                  pathname: '/',
                },
              );
              window.location.reload();
            }}
          >
            <span className="topbar__link-icon lnr lnr-exit lnr-red" />
            <p className="topbar__link-title" style={{ color: 'red' }}>Logout</p>
          </Link>
        </div>
      </Collapse>
    </div>
  );
};

export default TopbarProfile;
