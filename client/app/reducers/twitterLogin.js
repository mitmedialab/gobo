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
    GET_FACEBOOK_APP_ID_LOAD,
    GET_FACEBOOK_APP_ID_FAIL,
    GET_FACEBOOK_APP_ID_SUCCESS,
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
    facebookAppId: null,

};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case GET_AUTH_URL_LOAD:
            return {
                ...state,
                loading_oauth_url: true,
                oauth_url: null,
            };
        case GET_AUTH_URL_SUCCESS:
            return {
                ...state,
                oauth_url: action.result.data.url,
                loading_oauth_url: false,
            };
        case GET_AUTH_URL_FAIL:
            return {
                ...state,
                loading_oauth_url_error: true,
                loading_oauth_url: false,
                oauth_url: null,
            };
        case FETCH_TWITTER_STATUS_LOAD:
            return {
                ...state,
                isFetching: true
            };
        case FETCH_TWITTER_STATUS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                isTwitterAuthorized:action.result.isTwitterAuthorized,

            };
        case FETCH_TWITTER_STATUS_FAIL:
            return {
                ...state,
                isFetching: false,
            };
        case POST_CALLBACK_LOAD:
            return {
                ...state,
                callbackLoading: true
            };
        case POST_CALLBACK_SUCCESS:
            return {
                ...state,
                callbackLoading: false,
            };
        case POST_CALLBACK_FAIL:
            return {
                ...state,
                callbackLoading: false,
            };
        case GET_FACEBOOK_APP_ID_SUCCESS:
            return {
                ...state,
                facebookAppId: action.result.data,
            };
        default:
            return state;
    }
}
