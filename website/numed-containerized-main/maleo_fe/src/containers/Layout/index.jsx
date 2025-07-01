import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Topbar from './topbar/Topbar';
import Sidebar from './sidebar/Sidebar';
import { changeThemeToDark, changeThemeToLight } from '../../redux/actions/themeActions';
import { changeMobileSidebarVisibility, changeSidebarVisibility } from '../../redux/actions/sidebarActions';
import { SidebarProps, TopbarProps, ThemeProps } from '../../shared/prop-types/ReducerProps';

const Layout = ({
  dispatch, sidebar, topbar, theme,
}) => {
  const layoutClass = classNames({
    layout: true,
    'layout--collapse': sidebar.collapse,
  });

  const sidebarVisibility = () => {
    dispatch(changeSidebarVisibility());
  };

  const mobileSidebarVisibility = () => {
    dispatch(changeMobileSidebarVisibility());
  };

  const changeToDark = () => {
    dispatch(changeThemeToDark());
  };

  const changeToLight = () => {
    dispatch(changeThemeToLight());
  };

  return (
    <div className={layoutClass}>
      <Topbar
        changeMobileSidebarVisibility={mobileSidebarVisibility}
        changeSidebarVisibility={sidebarVisibility}
        topbar={topbar}
        changeToDark={changeToDark}
        changeToLight={changeToLight}
        theme={theme}
      />
      <Sidebar
        sidebar={sidebar}
        changeToDark={changeToDark}
        changeToLight={changeToLight}
        changeMobileSidebarVisibility={mobileSidebarVisibility}
      />
    </div>
  );
};

Layout.propTypes = {
  dispatch: PropTypes.func.isRequired,
  sidebar: SidebarProps.isRequired,
  topbar: TopbarProps.isRequired,
  theme: ThemeProps.isRequired,
};

export default withRouter(connect((state) => ({
  sidebar: state.sidebar,
  topbar: state.topbar,
  theme: state.theme,
}))(Layout));
