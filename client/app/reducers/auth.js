import { createReducer } from '../utils/misc';
import {
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAILURE,
	LOGIN_USER_REQUEST,
	LOGOUT_USER,
	REGISTER_USER_FAILURE,
	REGISTER_USER_REQUEST,
	REGISTER_USER_SUCCESS,
	GET_USER_LOAD,
	GET_USER_SUCCESS,
	GET_USER_FAIL,
	DELETE_USER_REQUEST,
	DELETE_USER_SUCCESS,
	DELETE_USER_FAILURE,
} from '../constants/index';

const initialState = {
	user: null,
	userName: null,
	isAuthenticated: false,
	isAuthenticating: false,
	statusText: null,
	isRegistering: false,
	isRegistered: false,
	registerStatusText: null,
};

export default createReducer(initialState, {
	[LOGIN_USER_REQUEST]: state =>
		Object.assign({}, state, {
			isAuthenticating: true,
			statusText: null,
		}),
	[LOGIN_USER_SUCCESS]: (state, payload) =>
		Object.assign({}, state, {
			isAuthenticating: false,
			isAuthenticated: true,
			user: payload.user,
			statusText: 'You have been successfully logged in.',
		}),
	[LOGIN_USER_FAILURE]: (state, payload) =>
		Object.assign({}, state, {
			isAuthenticating: false,
			isAuthenticated: false,
			user: null,
			userName: null,
			statusText: `${payload.statusText}`,
		}),
	[LOGOUT_USER]: state =>
		Object.assign({}, state, {
			isAuthenticating: false,
			isAuthenticated: false,
			isRegistering: false,
			isRegistered: false,
			user: null,
			userName: null,
			statusText: null,
			registerStatusText: null,
		}),
	[REGISTER_USER_SUCCESS]: (state, payload) =>
		Object.assign({}, state, {
			isAuthenticating: false,
			isAuthenticated: true,
			isRegistering: false,
			isRegistered: true,
			user: payload.user,
			userName: 'TBD fix me',
			registerStatusText: 'You have successfully registered!',
		}),
	[REGISTER_USER_REQUEST]: state =>
		Object.assign({}, state, {
			isRegistering: true,
			registerStatusText: null,
		}),
	[REGISTER_USER_FAILURE]: (state, payload) =>
		Object.assign({}, state, {
			isAuthenticated: false,
			isRegistering: false,
			user: null,
			userName: null,
			registerStatusText: payload.statusText,
		}),
	[GET_USER_LOAD]: state =>
		Object.assign({}, state, {
			isAuthenticating: true,
			statusText: null,
			registerStatusText: null,
		}),
	[GET_USER_SUCCESS]: (state, payload) => {
		return (
			Object.assign({}, state, {
				isAuthenticating: false,
				isAuthenticated: true,
				user: payload.user,
			}));
	},
	[GET_USER_FAIL]: state =>
		Object.assign({}, state, {
			isAuthenticating: false,
			isAuthenticated: false,
			user: null,
			userName: null,
			statusText: null,
			registerStatusText: null,
		}),
	[DELETE_USER_REQUEST]: state =>
	Object.assign({}, state, {
		isAuthenticating: false,
		statusText: null,
	}),
	[DELETE_USER_SUCCESS]: state =>
		Object.assign({}, state, {
			isAuthenticating: false,
			isAuthenticated: false,
			user: null,
			userName: null,
			statusText: 'You have successfully deleted your account.',
		}),
	[DELETE_USER_FAILURE]: state =>
		Object.assign({}, state, {
			isAuthenticating: false,
			isAuthenticated: true,
			statusText: 'There was an error in deleting your account. Please try again.',
		}),
});
