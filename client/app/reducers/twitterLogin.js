/* ---------- */
// Load Actions
/* ---------- */
import {
    GET_AUTH_URL_LOAD,
    GET_AUTH_URL_SUCCESS,
    GET_AUTH_URL_FAIL,
    FETCH_TWITTER_STATUS_LOAD,
    FETCH_TWITTER_STATUS_SUCCESS,
    FETCH_TWITTER_STATUS_FAIL,
    POST_CALLBACK_LOAD,
    POST_CALLBACK_SUCCESS,
    POST_CALLBACK_FAIL,
} from 'actions/twitterLogin';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
    oauth_url: null,
    loading_oauth_url: false,
    loading_oauth_url_error: false,
    isFetching: false,
    isTwitterAuthorized: false,
    callbackLoading: false,

};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case GET_AUTH_URL_LOAD:
            return {
                loading_oauth_url: true,
                oauth_url: null,
            };
        case GET_AUTH_URL_SUCCESS:
            return {
                oauth_url: action.result.data.url,
                loading_oauth_url: false,
            };
        case GET_AUTH_URL_FAIL:
            return {
                loading_oauth_url_error: true,
                loading_oauth_url: false,
                oauth_url: null,
            };
        case FETCH_TWITTER_STATUS_LOAD:
            return {
                isFetching: true
            };
        case FETCH_TWITTER_STATUS_SUCCESS:
            console.log('success', action)
            return {
                isFetching: false,
                isTwitterAuthorized:action.result.isTwitterAuthorized,

            };
        case FETCH_TWITTER_STATUS_FAIL:
            return {
                isFetching: false,
            };
        case POST_CALLBACK_LOAD:
            return {
                callbackLoading: true
            };
        case POST_CALLBACK_SUCCESS:
            return {
                callbackLoading: false,
            };
        case POST_CALLBACK_FAIL:
            return {
                callbackLoading: false,
            };
        default:
            return state;
    }
}
