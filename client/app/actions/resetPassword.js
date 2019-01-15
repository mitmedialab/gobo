import { emailResetPassword, updatePassword } from '../utils/apiRequests';

export const EMAIL_RESET_PASSWORD_REQUEST = 'password/EMAIL_RESET_PASSWORD_REQUEST';
export const EMAIL_RESET_PASSWORD_REQUEST_FAILURE = 'password/EMAIL_RESET_PASSWORD_REQUEST_FAILURE';
export const EMAIL_RESET_PASSWORD_REQUEST_SUCCESS = 'password/EMAIL_RESET_PASSWORD_REQUEST_SUCCESS';

export const RESET_PASSWORD_REQUEST = 'password/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_FAILURE = 'password/RESET_PASSWORD_FAILURE';
export const RESET_PASSWORD_SUCCESS = 'password/RESET_PASSWORD_SUCCESS';

export function emailResetPasswordRequest() {
  return {
    type: EMAIL_RESET_PASSWORD_REQUEST,
  };
}

export function emailSentFailure(error) {
  return {
    type: EMAIL_RESET_PASSWORD_REQUEST_FAILURE,
    payload: {
      statusText: error.response.statusText,
    },
  };
}

export function emailSentSuccess() {
  return {
    type: EMAIL_RESET_PASSWORD_REQUEST_SUCCESS,
    payload: {
      status: 200,
      statusText: 'Check your email for instructions to reset your password.',
    },
  };
}

export function sendResetPassword(email) {
  return (dispatch) => {
    dispatch(emailResetPasswordRequest());
    return emailResetPassword(email)
      .then((response) => {
        if (response.status === 200) {
          dispatch(emailSentSuccess());
        } else if (response.status === 404) {
          dispatch(emailSentFailure({
            response: {
              status: 404,
              statusText: 'Email not found. Try again.',
            },
          }));
        } else {
          dispatch(emailSentFailure({
            response: {
              status: 500,
              statusText: 'Something went wrong. Try again.',
            },
          }));
        }
      })
      .catch(() => {
        dispatch(emailSentFailure({
          response: {
            status: 500,
            statusText: 'Something went wrong. Try again.',
          },
        }));
      });
  };
}


export function resetPasswordRequest() {
  return {
    type: RESET_PASSWORD_REQUEST,
  };
}

export function resetPasswordFailure(error) {
  return {
    type: RESET_PASSWORD_FAILURE,
    payload: {
      statusText: error.response.statusText,
    },
  };
}

export function resetPasswordSuccess(user) {
  return {
    type: RESET_PASSWORD_SUCCESS,
    payload: {
      user,
    },
  };
}

export function resetPassword(token, password) {
  return (dispatch) => {
    dispatch(resetPasswordRequest());
    return updatePassword(token, password)
      .then((response) => {
        if (response.status === 200) {
          dispatch(resetPasswordSuccess());
        } else if (response.status === 404) {
          dispatch(resetPasswordFailure({
            response: {
              status: 404,
              statusText: 'Email not found.',
            },
          }));
        } else {
          dispatch(resetPasswordFailure({
            response: {
              status: 400,
              statusText: 'Password reset expired.',
            },
          }));
        }
      })
      .catch(() => {
        dispatch(resetPasswordFailure({
          response: {
            status: 500,
            statusText: 'Something went wrong. Try again.',
          },
        }));
      });
  };
}
