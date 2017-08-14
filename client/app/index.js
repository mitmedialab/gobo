/* global Raven */

import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-g-analytics';

import App from 'components/App/App';
import ManageScroll from 'components/ManageScroll/ManageScroll';
import store from './store';

// Raven.config(<Raven-URI>).install();
// require('./manageServiceWorker');

const Root = () => (
	<Provider store={store}>
		<BrowserRouter id="UA-*******-**">
			<ManageScroll>
				<App />
			</ManageScroll>
		</BrowserRouter>
	</Provider>
);

export default Root;

if (!module.hot) render(<Root />, document.querySelector('react'));
