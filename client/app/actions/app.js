import { apiFetch } from 'utils/utilities';

/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const GET_DATA_LOAD = 'app/GET_DATA_LOAD';
export const GET_DATA_SUCCESS = 'app/GET_DATA_SUCCESS';
export const GET_DATA_FAIL = 'app/GET_DATA_FAIL';


/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function getData(user) {
  return (dispatch) => {
    dispatch({ type: GET_DATA_LOAD });
    return apiFetch(user)
    .then((result) => {
      dispatch({ type: GET_DATA_SUCCESS, result });
    })
    .catch((error) => {
      dispatch({ type: GET_DATA_FAIL, error });
    });
  };
}
