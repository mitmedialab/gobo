import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';

export default combineReducers({
	app,
	auth,
});
