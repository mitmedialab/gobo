import {
    GET_POSTS_LOAD,
    GET_POSTS_SUCCESS,
    GET_POSTS_FAIL,
    GET_SETTINGS_LOAD,
    GET_SETTINGS_SUCCESS,
    GET_SETTINGS_FAIL,
    UPDATE_SETTINGS,
    SORT_BY,
} from 'actions/feed';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
    loading_posts: false,
    get_posts_error: false,
    posts: [],
    loading_settings: false,
    get_settings_error: false,
    settings: {
        include_corporate:false,
        gender_filter_on: false,
        virality_min: 0,
        virality_max:1,
        gender_female_per:50,
        rudeness_min:0,
        rudeness_max:1,
    },
    get_settings_success: false,
    sort_by: null,
    sort_reverse: false,
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case GET_POSTS_LOAD:
            return {
                ...state,
                loading_posts: true,
            };
        case GET_POSTS_SUCCESS:
            return {
                ...state,
                posts: action.result.data.posts,
                loading_posts: false,
            };
        case GET_POSTS_FAIL:
            return {
                ...state,
                loading_posts: false,
                get_posts_error: true,
            };
        case GET_SETTINGS_LOAD:
            return {
                ...state,
                loading_settings: true,
            };
        case GET_SETTINGS_SUCCESS:
            return {
                ...state,
                settings: action.result.data,
                loading_settings: false,
                get_settings_success: true,
            };
        case GET_SETTINGS_FAIL:
            return {
                ...state,
                loading_settings: false,
                get_settings_error: true,
                get_settings_success: false,
            };
        case UPDATE_SETTINGS:
            return {
                ...state,
                settings: action.settings
            };
        case SORT_BY:
            return {
                ...state,
                sort_reverse: state.sort_by==action.sort_by? !state.sort_reverse : state.sort_reverse,
                sort_by: action.sort_by
            };
        default:
            return state;
    }
}
