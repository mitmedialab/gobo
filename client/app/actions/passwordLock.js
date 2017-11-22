import { getLockStatusFromServer, verifyPassword } from '../utils/apiRequests';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const LOCK_STATUS_LOAD = 'passwordLock/LOCK_STATUS_LOAD';
export const LOCK_STATUS_SUCCESS = 'passwordLock/LOCK_STATUS_SUCCESS';
export const LOCK_STATUS_FAIL = 'passwordLock/LOCK_STATUS_FAIL';
export const VERIFY_PW_LOAD = 'passwordLock/VERIFY_PW_LOAD';
export const VERIFY_PW_SUCCESS = 'passwordLock/VERIFY_PW_SUCCESS';
export const VERIFY_PW_FAIL = 'passwordLock/VERIFY_PW_FAIL';


/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getLockStatus() {
	return (dispatch) => {
		dispatch({ type: LOCK_STATUS_LOAD });
		return getLockStatusFromServer()
			.then((result) => {
				dispatch({ type: LOCK_STATUS_SUCCESS, result });
			})
			.catch((error) => {
				dispatch({ type: LOCK_STATUS_FAIL, error });
			});
	};
}

export function verifyBetaPassword(password) {
	return (dispatch) => {
		dispatch({ type: VERIFY_PW_LOAD });
		return verifyPassword(password)
			.then((result) => {
				dispatch({ type: VERIFY_PW_SUCCESS, result });
			})
			.catch((error) => {
				dispatch({ type: VERIFY_PW_FAIL, error });
			});
	};
}
