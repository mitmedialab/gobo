import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import trackingMiddleware from 'middlewares/trackingMiddleware';
import rootReducer from './reducers';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, trackingMiddleware)),
);
