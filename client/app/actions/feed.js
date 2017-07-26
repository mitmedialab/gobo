import { getUserPosts } from '../utils/apiRequests';

export const GET_POSTS_LOAD = 'feed/GET_POSTS_LOAD';
export const GET_POSTS_SUCCESS = 'feed/GET_POSTS_SUCCESS';
export const GET_POSTS_FAIL = 'feed/GET_POSTS_FAIL';


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
            })
            .catch((error) => {
                dispatch({ type: GET_POSTS_FAIL, error });
            });
    };
}