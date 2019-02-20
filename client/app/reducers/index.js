import { combineReducers } from 'redux';
import auth from './auth';
import socialMediaLogin from './socialMediaLogin';
import feed from './feed';
import passwordLock from './passwordLock';
import resetPassword from './resetPassword';

export default combineReducers({
  auth,
  socialMediaLogin,
  feed,
  passwordLock,
  resetPassword,
});
