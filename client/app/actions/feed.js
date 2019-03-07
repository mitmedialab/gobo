import { getUserRules, getUserPosts, getUserSettings, updateUserRules, updateUserSettings } from '../utils/apiRequests';
import calculateFilteredPosts from '../utils/filtering';

export const GET_POSTS_LOAD = 'feed/GET_POSTS_LOAD';
export const GET_POSTS_SUCCESS = 'feed/GET_POSTS_SUCCESS';
export const GET_POSTS_FAIL = 'feed/GET_POSTS_FAIL';
export const GET_SETTINGS_LOAD = 'feed/GET_SETTINGS_LOAD';
export const GET_SETTINGS_SUCCESS = 'feed/GET_SETTINGS_SUCCESS';
export const GET_SETTINGS_FAIL = 'feed/GET_SETTINGS_FAIL';
export const UPDATE_SETTINGS = 'feed/UPDATE_SETTINGS';
export const FILTER_POSTS_LOAD = 'feed/FILTER_POSTS_LOAD';
export const FILTER_POSTS_SUCCESS = 'feed/FILTER_POSTS_SUCCESS';
export const FILTER_POSTS_FAIL = 'feed/FILTER_POSTS_FAIL';
export const GET_RULES_LOAD = 'feed/GET_RULES_LOAD';
export const GET_RULES_SUCCESS = 'feed/GET_RULES_SUCCESS';
export const GET_RULES_FAIL = 'feed/GET_RULES_FAIL';
export const UPDATE_RULES = 'feed/UPDATE_RULES';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/

function filterPosts({ settings, rules } = {}) {
  return (dispatch, getState) => {
    dispatch({ type: FILTER_POSTS_LOAD });
    return calculateFilteredPosts(getState().feed.posts, settings || getState().feed.settings, rules || getState().feed.rules)
      .then((result) => {
        dispatch({ type: FILTER_POSTS_SUCCESS, result });
      })
      .catch((error) => {
        dispatch({ type: FILTER_POSTS_FAIL, error });
      });
  };
}

export function getPosts() {
  return (dispatch) => {
    dispatch({ type: GET_POSTS_LOAD });
    return getUserPosts()
      .then((result) => {
        dispatch({ type: GET_POSTS_SUCCESS, result });
        dispatch(filterPosts());
      })
      .catch((error) => {
        dispatch({ type: GET_POSTS_FAIL, error });
      });
  };
}

export function getSettings() {
  return (dispatch) => {
    dispatch({ type: GET_SETTINGS_LOAD });
    return getUserSettings()
      .then((result) => {
        dispatch({ type: GET_SETTINGS_SUCCESS, result });
        dispatch(filterPosts());
      })
      .catch((error) => {
        dispatch({ type: GET_SETTINGS_FAIL, error });
      });
  };
}

export function updateSettings(settings) {
  return (dispatch) => {
    dispatch({ type: UPDATE_SETTINGS, settings });
    updateUserSettings(settings);
    return dispatch(filterPosts({ settings }));
  };
}

export function getRules() {
  return (dispatch) => {
    dispatch({ type: GET_RULES_LOAD });
    return getUserRules()
      .then((result) => {
        dispatch({ type: GET_RULES_SUCCESS, result });
        dispatch(filterPosts());
      })
      .catch((error) => {
        dispatch({ type: GET_RULES_FAIL, error });
      });
  };
}

export function updateRules(rules) {
  return (dispatch) => {
    dispatch({ type: UPDATE_RULES, rules });
    updateUserRules(rules);
    return dispatch(filterPosts({ rules }));
  };
}
