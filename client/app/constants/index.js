export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGOUT_USER = 'LOGOUT_USER';

export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FAILURE = 'REGISTER_USER_FAILURE';
export const REGISTER_USER_REQUEST = 'REGISTER_USER_REQUEST';

export const GET_USER_LOAD = 'app/GET_USER_LOAD';
export const GET_USER_SUCCESS = 'app/GET_USER_SUCCESS';
export const GET_USER_FAIL = 'app/GET_USER_FAIL';

export const FETCH_PROTECTED_DATA_REQUEST = 'FETCH_PROTECTED_DATA_REQUEST';
export const RECEIVE_PROTECTED_DATA = 'RECEIVE_PROTECTED_DATA';

export const DELETE_USER_REQUEST = 'DELETE_USER_REQUEST';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export const DEFAULT_MASTODON_INSTANCES = [
  'mastodon.social',
  'mstdn.jp',
  'mastodon.cloud',
  'mastodon.xyz',
  'octodon.social',
  'mastodon.technology',
];

export const VERSION = 'v2.25.0';
export const API_URL = ''; // process.env.NODE_ENV === 'production' ? '': 'http://localhost:5000/'
