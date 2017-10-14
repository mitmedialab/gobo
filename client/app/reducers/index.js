import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
import twitterLogin from './twitterLogin';
import feed from './feed';
import passwordLock from './passwordLock';

export default combineReducers({
	app,
	auth,
	twitterLogin,
	feed,
	passwordLock,
});
