import { getTwitterAuthURl, waitTwitterCallback, postTwitterCallback } from '../utils/apiRequests';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_AUTH_URL_LOAD = 'twitterLogin/GET_AUTH_URL_LOAD';
export const GET_AUTH_URL_SUCCESS = 'twitterLogin/GET_AUTH_URL_SUCCESS';
export const GET_AUTH_URL_FAIL = 'twitterLogin/GET_AUTH_URL_FAIL';
export const FETCH_TWITTER_STATUS_LOAD = 'twitterLogin/FETCH_TWITTER_STATUS_LOAD';
export const FETCH_TWITTER_STATUS_SUCCESS = 'twitterLogin/FETCH_TWITTER_STATUS_SUCCESS';
export const FETCH_TWITTER_STATUS_FAIL = 'twitterLogin/FETCH_TWITTER_STATUS_FAIL';
export const POST_CALLBACK_LOAD = 'twitterLogin/POST_CALLBACK_LOAD';
export const POST_CALLBACK_SUCCESS = 'twitterLogin/POST_CALLBACK_SUCCESS';
export const POST_CALLBACK_FAIL = 'twitterLogin/POST_CALLBACK_FAIL';


/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getAuthUrl() {
	return (dispatch) => {
		dispatch({ type: GET_AUTH_URL_LOAD });
		return getTwitterAuthURl()
		.then((result) => {
			dispatch({ type: GET_AUTH_URL_SUCCESS, result });
		})
		.catch((error) => {
			dispatch({ type: GET_AUTH_URL_FAIL, error });
		});
	};
}

export function startPostTwitterCallback(query) {
    return (dispatch) => {
        dispatch({ type: POST_CALLBACK_LOAD });
        return postTwitterCallback(query)
            .then((result) => {
                dispatch({ type: POST_CALLBACK_SUCCESS, result });
            })
            .catch((error) => {
                dispatch({ type: POST_CALLBACK_FAIL, error });
            });
    };
}

export function waitForTwitterCallback() {
    return (dispatch) => {
        dispatch({ type: FETCH_TWITTER_STATUS_LOAD });
        return waitTwitterCallback()
            .then((response) => {
        		let result = response.data;
                dispatch({ type: FETCH_TWITTER_STATUS_SUCCESS, result });
            })
            .catch((error) => {
                dispatch({ type: FETCH_TWITTER_STATUS_FAIL, error });
            });
    };
}
