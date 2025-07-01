/* eslint-disable no-console */
import { LOCALSTORAGE_USERDETAIL, LOCALSTORAGE_TOKEN } from './Types';

export const getOidcStorageKey = () => {
  const authSettings = JSON.parse(localStorage.getItem('authSettings'));
  if (authSettings) {
    return `oidc.user:${authSettings.auth_server}:${authSettings.client_id}`;
  }
  return null;
};

export const getOidcInfo = () => {
  const key = getOidcStorageKey();
  if (key) {
    const oidc = JSON.parse(localStorage.getItem(key));
    return oidc;
  }
  return null;
};

export const getToken = () => {
  const oidc = getOidcInfo();
  if (oidc) {
    return oidc.id_token;
  }
  return null;
};

export const isLogin = () => {
  if (localStorage.getItem(LOCALSTORAGE_TOKEN)) {
    return true;
  }

  return false;
};

export const roleValidation = () => {
  if (localStorage.getItem(LOCALSTORAGE_TOKEN)) {
    const localdata = JSON.parse(localStorage.getItem(LOCALSTORAGE_USERDETAIL));
    // console.log('LOCALDATA', localdata.role);
    return localdata.role;
  }

  return null;
};
