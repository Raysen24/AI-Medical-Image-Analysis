import React, { Fragment, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../../scss/app.scss';
import Router from './Router';
import store from './store';
import { config as i18nextConfig } from '../../translations';
import ScrollToTop from './ScrollToTop';

i18n.init(i18nextConfig);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    window.addEventListener('load', () => {
      setIsLoading(false);
      setTimeout(() => setIsLoaded(true), 500);
    });
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <ScrollToTop>
            <Fragment>
              {!isLoaded && (
              <div className={`load${isLoading ? '' : ' loaded'}`}>
                <div className="load__icon-wrap">
                  <svg className="load__icon">
                    <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                  </svg>
                </div>
              </div>
              )}
              <div>
                <Router />
              </div>
            </Fragment>
          </ScrollToTop>
        </I18nextProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
