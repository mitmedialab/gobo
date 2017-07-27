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
    GET_USER_FAIL

} from '../constants/index';

import { parseJSON } from '../utils/misc';
import { login, register, getUser, apiLogout } from '../utils/apiRequests';


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
            status: error.response.status,
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
            .then((result) => {
                dispatch({ type: LOGOUT_USER} );
            })
            .catch((error) => {
                console.log('logout failed!!', error);
                dispatch({ type: LOGOUT_USER} );
            });
    };
}


export function loginUser(email, password) {
    return function (dispatch) {
        dispatch(loginUserRequest());
        return login(email, password)
            .then(parseJSON)
            .then(response => {
                    if (response.result){
                    try {
                        dispatch(loginUserSuccess(response.user));
                    } catch (e) {
                        dispatch(loginUserFailure({
                        response: {
                            status: 403,
                            statusText: 'Login failed. Try again',
                        },
                    }));
                }}
                else {
                        dispatch(loginUserFailure({
                            response: {
                                status: 403,
                                statusText: 'Wrong User name or password, please try again',
                            },
                        }));
                    }
            })
            .catch(error => {
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
            user:result,
            statusText: "you are successfully registered!"
        }
    };
}

export function registerUserFailure(error) {
    return {
        type: REGISTER_USER_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function registerUser(email, password) {
    return function (dispatch) {
        dispatch(registerUserRequest());
        return register(email, password)
            .then(response => {
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
            .catch(error => {
                dispatch(registerUserFailure({
                        response: {
                            status: 403,
                            statusText: 'User with that email already exists',
                        },
                    }
                ));
            });
    };
}

export function tryGetUser() {
    return (dispatch) => {
        dispatch({ type: GET_USER_LOAD });
        return getUser()
            .then((result) => {
                dispatch({ type: GET_USER_SUCCESS, payload:result.data});
            })
            .catch((error) => {
                dispatch({ type: GET_USER_FAIL, payload:error });
            });
    };
}