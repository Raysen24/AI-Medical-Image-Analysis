import PropTypes from 'prop-types';

const {
  func, shape, string, bool,
} = PropTypes;

export const CustomizerProps = shape({
  topNavigation: bool,
});

export const SidebarProps = shape({
  show: PropTypes.bool,
  collapse: PropTypes.bool,
});
export const TopbarProps = shape({
  show: PropTypes.bool,
  collapse: PropTypes.bool,
});

export const ThemeProps = shape({
  className: string,
});

export const RTLProps = shape({
  direction: string,
});

export const RoundBordersProps = shape({
  roundBorders: string,
});

export const BlocksShadowsProps = shape({
  blocksShadows: string,
});

export const UserProps = shape({
  fullName: string,
  avatar: string,
});

export const AuthOProps = shape({
  isAuthenticated: bool,
  loading: bool,
  user: shape({
    name: string,
    picture: string,
  }),
  logout: func,
});
