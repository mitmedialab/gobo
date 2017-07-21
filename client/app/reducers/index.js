import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
import twitterLogin from './twitterLogin';

export default combineReducers({
	app,
	auth,
	twitterLogin,
});
