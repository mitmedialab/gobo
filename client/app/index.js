/* global Raven */

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import GoogleAnalytics from 'react-ga';

import App from 'components/App/App';
import ManageScroll from 'components/ManageScroll/ManageScroll';
import store from './store';

// raven options taken from https://docs.sentry.io/clients/javascript/tips/ with some additions
// eslint-disable-next-line no-unused-vars
const ravenOptions = {
  ignoreErrors: [
        // Random plugins/extensions
    'top.GLOBALS',
        // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error. html
    'originalCreateNotification',
    'canvas.contentDocument',
    'MyApp_RemoveAllHighlights',
    'http://tt.epicplay.com',
    'Can\'t find variable: ZiteReader',
    'jigsaw is not defined',
    'ComboSearch is not defined',
    'http://loading.retry.widdit.com/',
    'atomicFindClose',
        // Facebook borked
    'fb_xd_fragment',
        // ISP "optimizing" proxy - `Cache-Control: no-transform` seems to
        // reduce this. (thanks @acdha)
        // See http://stackoverflow.com/questions/4113268
    'bmi_SafeAddOnload',
    'EBCallBackMessageReceived',
        // See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
    'conduitPage',
  ],
  ignoreUrls: [
        // Facebook flakiness
    /graph\.facebook\.com/i,
        // Facebook blocked
    /connect\.facebook\.net\/en_US\/all\.js/i,
        // Woopra flakiness
    /eatdifferent\.com\.woopra-ns\.com/i,
    /static\.woopra\.com\/js\/woopra\.js/i,
        // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
        // Other plugins
    /127\.0\.0\.1:4001\/isrunning/i,  // Cacaoweb
    /webappstoolbarba\.texthelp\.com\//i,
    /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
    /localhost:5000\/api\/confirm_auth/i,
    /gobo\.mcservices1\.media\.mit\.edu\/api\/confirm_auth/i,
  ],
};

Raven.config('https://d2a0fea6a02c4cd490b46c7a7ec91992@sentry.io/221335').install();
// require('./manageServiceWorker');

GoogleAnalytics.initialize('UA-********-**');

const Root = () => (
  <Provider store={store}>
    <BrowserRouter>
      <ManageScroll>
        <App />
      </ManageScroll>
    </BrowserRouter>
  </Provider>
);

export default Root;

if (!module.hot) render(<Root />, document.querySelector('react'));
