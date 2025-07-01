/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ThemeProps } from '../../../shared/prop-types/ReducerProps';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarProfile from './TopbarProfile';
import TopbarLanguage from './TopbarLanguage';

const Topbar = ({
  changeMobileSidebarVisibility, changeSidebarVisibility, changeToDark, changeToLight, theme,
}) => (
  <div className="topbar">
    <div className="topbar__wrapper">
      <div className="topbar__left">
        <TopbarSidebarButton
          changeMobileSidebarVisibility={changeMobileSidebarVisibility}
          changeSidebarVisibility={changeSidebarVisibility}
        />
        <Link className="topbar__logo" to="/account/welcome-statement/" />
      </div>
      <div className="topbar__right">
        <div className="topbar__right-search">
          <div className="topbar__right-over">
            <div className="topbar__search">
              <label className="toggle-btn customizer__toggle" htmlFor="theme_toggle">
                <input
                  className="toggle-btn__input"
                  type="checkbox"
                  name="theme_toggle"
                  id="theme_toggle"
                  checked={theme.className === 'theme-dark'}
                  onClick={theme.className === 'theme-dark' ? changeToLight : changeToDark}
                />
                <span className="toggle-btn__input-label" />
                {/* <span>Mode</span> */}
              </label>
            </div>
          </div>
        </div>
        <TopbarProfile />
        <TopbarLanguage />

      </div>
    </div>
  </div>
);

Topbar.propTypes = {
  changeMobileSidebarVisibility: PropTypes.func.isRequired,
  changeSidebarVisibility: PropTypes.func.isRequired,
  changeToDark: PropTypes.func.isRequired,
  changeToLight: PropTypes.func.isRequired,
  theme: ThemeProps.isRequired,
};

export default Topbar;
