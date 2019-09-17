import {
  getTwitterAuthURl,
  waitTwitterCallback,
  postTwitterCallback,
  getFacebookAppId,
  getMastodonVerification,
  postMastodonToken,
  postMastodonDomain,
} from '../utils/apiRequests';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_TWITTER_AUTH_URL_LOAD = 'smLogin/GET_TWITTER_AUTH_URL_LOAD';
export const GET_TWITTER_AUTH_URL_SUCCESS = 'smLogin/GET_TWITTER_AUTH_URL_SUCCESS';
export const GET_TWITTER_AUTH_URL_FAIL = 'smLogin/GET_TWITTER_AUTH_URL_FAIL';

export const FETCH_TWITTER_STATUS_LOAD = 'smLogin/FETCH_TWITTER_STATUS_LOAD';
export const FETCH_TWITTER_STATUS_SUCCESS = 'smLogin/FETCH_TWITTER_STATUS_SUCCESS';
export const FETCH_TWITTER_STATUS_FAIL = 'smLogin/FETCH_TWITTER_STATUS_FAIL';

export const POST_CALLBACK_LOAD = 'smLogin/POST_CALLBACK_LOAD';
export const POST_CALLBACK_SUCCESS = 'smLogin/POST_CALLBACK_SUCCESS';
export const POST_CALLBACK_FAIL = 'smLogin/POST_CALLBACK_FAIL';

export const GET_FACEBOOK_APP_ID_LOAD = 'smLogin/GET_FACEBOOK_APP_ID_LOAD';
export const GET_FACEBOOK_APP_ID_FAIL = 'smLogin/GET_FACEBOOK_APP_ID_FAIL';
export const GET_FACEBOOK_APP_ID_SUCCESS = 'smLogin/GET_FACEBOOK_APP_ID_SUCCESS';

export const GET_MASTODON_VERIFICATION_LOAD = 'smLogin/GET_MASTODON_VERIFICATION_LOAD';
export const GET_MASTODON_VERIFICATION_FAIL = 'smLogin/GET_MASTODON_VERIFICATION_FAIL';
export const GET_MASTODON_VERIFICATION_SUCCESS = 'smLogin/GET_MASTODON_VERIFICATION_SUCCESS';

export const POST_MASTODON_DOMAIN_LOAD = 'smLogin/POST_MASTODON_DOMAIN_LOAD';
export const POST_MASTODON_DOMAIN_FAIL = 'smLogin/POST_MASTODON_DOMAIN_FAIL';
export const POST_MASTODON_DOMAIN_SUCCESS = 'smLogin/POST_MASTODON_DOMAIN_SUCCESS';

export const POST_MASTODON_AUTH_LOAD = 'smLogin/POST_MASTODON_AUTH_LOAD';
export const POST_MASTODON_AUTH_FAIL = 'smLogin/POST_MASTODON_AUTH_FAIL';
export const POST_MASTODON_AUTH_SUCCESS = 'smLogin/POST_MASTODON_AUTH_SUCCESS';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getTwitterAuthUrl() {
  return (dispatch) => {
    dispatch({ type: GET_TWITTER_AUTH_URL_LOAD });
    return getTwitterAuthURl()
      .then((result) => {
        dispatch({ type: GET_TWITTER_AUTH_URL_SUCCESS, result });
      })
      .catch((error) => {
        dispatch({ type: GET_TWITTER_AUTH_URL_FAIL, error });
      });
  };
}

export function fetchFacebookAppId() {
  return (dispatch) => {
    dispatch({ type: GET_FACEBOOK_APP_ID_LOAD });
    return getFacebookAppId()
      .then((result) => {
        dispatch({ type: GET_FACEBOOK_APP_ID_SUCCESS, result });
      })
      .catch((error) => {
        dispatch({ type: GET_FACEBOOK_APP_ID_FAIL, error });
      });
  };
}

export function fetchMastodonVerification() {
  return (dispatch) => {
    dispatch({ type: GET_MASTODON_VERIFICATION_LOAD });
    return getMastodonVerification()
      .then((result) => {
        dispatch({ type: GET_MASTODON_VERIFICATION_SUCCESS, result });
      })
      .catch((error) => {
        dispatch({ type: GET_MASTODON_VERIFICATION_FAIL, error });
      });
  };
}

export function mastodonToken(authCode) {
  return (dispatch) => {
    dispatch({ type: POST_MASTODON_AUTH_LOAD });
    return postMastodonToken({ authorization_code: authCode })
      .then((result) => {
        dispatch({ type: POST_MASTODON_AUTH_SUCCESS, result });
      })
      .catch((error) => {
        dispatch({ type: POST_MASTODON_AUTH_FAIL, error });
      });
  };
}

export function mastodonDomain(domain) {
  return (dispatch) => {
    dispatch({ type: POST_MASTODON_DOMAIN_LOAD });
    return postMastodonDomain(domain)
      .then((result) => {
        dispatch({ type: POST_MASTODON_DOMAIN_SUCCESS, result });
      })
      .catch((error) => {
        dispatch({ type: POST_MASTODON_DOMAIN_FAIL, error });
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
        const result = response.data;
        dispatch({ type: FETCH_TWITTER_STATUS_SUCCESS, result });
      })
      .catch((error) => {
        dispatch({ type: FETCH_TWITTER_STATUS_FAIL, error });
      });
  };
}
