import { getUserPosts, getUserSettings, updateUserSettings } from '../utils/apiRequests';
import { calculateFilteredPosts } from '../utils/filtering';

export const GET_POSTS_LOAD = 'feed/GET_POSTS_LOAD';
export const GET_POSTS_SUCCESS = 'feed/GET_POSTS_SUCCESS';
export const GET_POSTS_FAIL = 'feed/GET_POSTS_FAIL';
export const GET_SETTINGS_LOAD = 'feed/GET_SETTINGS_LOAD';
export const GET_SETTINGS_SUCCESS = 'feed/GET_SETTINGS_SUCCESS';
export const GET_SETTINGS_FAIL = 'feed/GET_SETTINGS_FAIL';
export const UPDATE_SETTINGS = 'feed/UPDATE_SETTINGS';
export const SORT_BY = 'feed/SORT_BY';
export const FILTER_POSTS_LOAD = 'feed/FILTER_POSTS_LOAD';
export const FILTER_POSTS_SUCCESS = 'feed/FILTER_POSTS_SUCCESS';
export const FILTER_POSTS_FAIL = 'feed/FILTER_POSTS_FAIL';


/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getPosts() {
    return (dispatch) => {
        dispatch({ type: GET_POSTS_LOAD });
        return getUserPosts()
            .then((result) => {
                dispatch({ type: GET_POSTS_SUCCESS, result });
                dispatch(filterPosts(null));
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
                dispatch(filterPosts(null))
            })
            .catch((error) => {
                dispatch({ type: GET_SETTINGS_FAIL, error });
            });
    };
}

export function updateSettings(settings) {
    return (dispatch) => {
        dispatch({ type: UPDATE_SETTINGS , settings})
        updateUserSettings(settings);
        return dispatch(filterPosts(settings));
    };
}

export function filterPosts(settings) {
    return (dispatch, getState) => {
        dispatch({ type: FILTER_POSTS_LOAD });
        return calculateFilteredPosts(getState().feed.posts, settings||getState().feed.settings)
            .then((result) => {
                dispatch({ type: FILTER_POSTS_SUCCESS, result });
            })
            .catch((error) => {
                dispatch({ type: FILTER_POSTS_FAIL, error });
            });
    };
}

export function sortBy(sort_by) {
    return (dispatch) => {
        dispatch({ type: SORT_BY , sort_by});
    };
}

export function changeSettingsClicked() {
    return (dispatch) => {
        dispatch({ type: CHANGE_SETTINGS_CLICKED });
    };
}

