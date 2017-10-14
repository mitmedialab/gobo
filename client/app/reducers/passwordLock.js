/* ---------- */
// Load Actions
/* ---------- */
import {
    LOCK_STATUS_LOAD,
    LOCK_STATUS_SUCCESS,
    LOCK_STATUS_FAIL,
    VERIFY_PW_LOAD,
    VERIFY_PW_SUCCESS,
    VERIFY_PW_FAIL,
} from 'actions/passwordLock';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
    is_locked: true,
    loading_lock_status: false,
    password_verified: false,
    checking_password: false,
    pw_error_text: "",
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case LOCK_STATUS_LOAD:
            return {
                ...state,
                loading_lock_status: true,
            };
        case LOCK_STATUS_SUCCESS:
            return {
                ...state,
                is_locked: action.result.data.locked,
                loading_lock_status: false,
            };
        case LOCK_STATUS_FAIL:
            return {
                ...state,
                is_locked: false,
                loading_lock_status: false,
            };
        case VERIFY_PW_LOAD:
            return {
                ...state,
                checking_password: true
            };
        case VERIFY_PW_SUCCESS:
            return {
                ...state,
                checking_password: false,
                password_verified:action.result.data.success,
                pw_error_text:action.result.data.success? "": "wrong password! try again",

            };
        case VERIFY_PW_FAIL:
            return {
                ...state,
                checking_password: false,
                password_verified: false,
                pw_error_text: "There was an error verifying the password. pleas try again",
            };
        default:
            return state;
    }
}
