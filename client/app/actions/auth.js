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
import { parseJSON } from '../utils/misc';
import { login, register, getUser, apiLogout, deleteAccount} from '../utils/apiRequests';

export function loginUserSuccess(user) {
	return {
		type: LOGIN_USER_SUCCESS,
		payload: {
			user,
		},
	};
}

export function loginUserFailure(error) {
	return {
		type: LOGIN_USER_FAILURE,
		payload: {
			statusText: error.response.statusText,
		},
	};
}

export function loginUserRequest() {
	return {
		type: LOGIN_USER_REQUEST,
	};
}

export function logout() {
	return (dispatch) => {
		return apiLogout()
			.then(() => {
				dispatch({ type: LOGOUT_USER });
			})
			.catch(() => {
				// console.log('logout failed!!', error);
				dispatch({ type: LOGOUT_USER });
			});
	};
}


export function loginUser(email, password) {
	return function (dispatch) {
		dispatch(loginUserRequest());
		return login(email, password)
			.then(parseJSON)
			.then((response) => {
				if (response.result) {
					try {
						dispatch(loginUserSuccess(response.user));
					} catch (e) {
						dispatch(loginUserFailure({
							response: {
								status: 403,
								statusText: 'Login failed. Try again',
							},
						}));
					}
				} else {
					dispatch(loginUserFailure({
						response: {
							status: 403,
							statusText: 'Wrong User name or password, please try again',
						},
					}));
				}
			})
			.catch(() => {
				dispatch(loginUserFailure({
					response: {
						status: 403,
						statusText: 'Invalid username or password',
					},
				}));
			});
	};
}


export function registerUserRequest() {
	return {
		type: REGISTER_USER_REQUEST,
	};
}

export function registerUserSuccess(result) {
	return {
		type: REGISTER_USER_SUCCESS,
		payload: {
			user: result,
			statusText: 'you are successfully registered!',
		}
	};
}

export function registerUserFailure(error) {
	return {
		type: REGISTER_USER_FAILURE,
		payload: {
			status: error.response.status,
			statusText: error.response.data.statusText,
		},
	};
}

export function registerUser(email, password) {
	return function (dispatch) {
		dispatch(registerUserRequest());
		return register(email, password)
			.then((response) => {
				try {
					dispatch(registerUserSuccess(response));
				} catch (e) {
					dispatch(registerUserFailure({
						response: {
							status: 403,
							statusText: 'Invalid token',
						},
					}));
				}
			})
			.catch((error) => {
				dispatch(registerUserFailure(error));
			});
	};
}

export function tryGetUser() {
	return (dispatch) => {
		dispatch({ type: GET_USER_LOAD });
		return getUser()
			.then((result) => {
				dispatch({ type: GET_USER_SUCCESS, payload: result.data });
			})
			.catch((error) => {
				dispatch({ type: GET_USER_FAIL, payload: error });
			});
	};
}

export function deleteUserSuccess() {
	return {
		type: DELETE_USER_SUCCESS,
	};
}

export function deleteUserFailure(error) {
	return {
		type: DELETE_USER_FAILURE,
		payload: {
			response: error.response,
		}, 
	};
}

export function deleteUserRequest() {
	return {
		type: DELETE_USER_REQUEST,
	};
}

export function deleteUser() {
	return function (dispatch) {
			dispatch(deleteUserRequest());
			return deleteAccount()
				.then(parseJSON)
				.then((response) => {
					if (response.result) {
						try {
							dispatch(deleteUserSuccess());
						} catch (e) {
							dispatch(deleteUserFailure({response:response}));
						}
					} else {
						dispatch(deleteUserFailure({response:response}));
					}
				})
				.catch(() => {
					dispatch(deleteUserFailure({response:response}));
				});
		};
}

