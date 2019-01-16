import {
  EMAIL_RESET_PASSWORD_REQUEST,
  EMAIL_RESET_PASSWORD_REQUEST_FAILURE,
  EMAIL_RESET_PASSWORD_REQUEST_SUCCESS,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
} from 'actions/resetPassword';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case EMAIL_RESET_PASSWORD_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case EMAIL_RESET_PASSWORD_REQUEST_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        isFetching: false,
        statusText: action.payload.statusText,
      };
    case EMAIL_RESET_PASSWORD_REQUEST_FAILURE:
      return {
        ...state,
        isSuccess: false,
        isFetching: false,
        statusText: action.payload.statusText,
      };
    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case RESET_PASSWORD_FAILURE:
      return {
        ...state,
        isFetching: false,
        isSuccess: false,
        statusText: action.payload.statusText,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isSuccess: true,
        statusText: action.payload.statusText,
      };
    default:
      return state;
  }
}
