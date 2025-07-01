import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapse } from 'reactstrap';
import DownIcon from 'mdi-react/ChevronDownIcon';

const gb = `${process.env.PUBLIC_URL}/img/language/gb.png`;
const id = `${process.env.PUBLIC_URL}/img/language/id.svg`;

const GbLng = () => (
  <span className="topbar__language-btn-title">
    <img src={gb} alt="gb" />
    <span>EN</span>
  </span>
);

const IdLng = () => (
  <span className="topbar__language-btn-title">
    <img src={id} alt="id" />
    <span>ID</span>
  </span>
);

const TopbarLanguage = () => {
  const { i18n } = useTranslation('common');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mainButtonContent, setMainButtonContent] = useState(<GbLng />);

  const toggleLanguage = () => {
    setIsCollapsed(!isCollapsed);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
      .then(() => {
        switch (lng) {
          case ('en'):
            setMainButtonContent(<GbLng />);
            break;
          case 'id':
            setMainButtonContent(<IdLng />);
            break;
          default:
            setMainButtonContent(<GbLng />);
            break;
        }
      });
  };

  return (
    <div className="topbar__collapse topbar__collapse--language">
      <button className="topbar__btn" type="button" onClick={toggleLanguage}>
        {mainButtonContent}
        <DownIcon className="topbar__icon" />
      </button>
      {isCollapsed && (
        <button
          className="topbar__back"
          type="button"
          aria-label="language button"
          onClick={toggleLanguage}
        />
      )}
      <Collapse
        isOpen={isCollapsed}
        className="topbar__collapse-content topbar__collapse-content--language"
      >
        <button
          className="topbar__language-btn"
          type="button"
          onClick={() => changeLanguage('en')}
        >
          <GbLng />
        </button>
        <button
          className="topbar__language-btn"
          type="button"
          onClick={() => changeLanguage('id')}
        >
          <IdLng />
        </button>
      </Collapse>
    </div>
  );
};

export default TopbarLanguage;
