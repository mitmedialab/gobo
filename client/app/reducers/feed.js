import {
    GET_POSTS_LOAD,
    GET_POSTS_SUCCESS,
    GET_POSTS_FAIL,
} from 'actions/feed';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
    loading_posts: false,
    get_posts_error: false,
    posts: [],
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
        default:
            return state;
    }
}
