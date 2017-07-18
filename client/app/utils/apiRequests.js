import { API_URL } from 'constants/index';

import axios from 'axios';

export function register(email, password) {
    return axios.post(API_URL+'api/register', {
        email,
        password,
    });
}

export function login(email, password) {
    return axios.post(API_URL+'api/login', {
        email,
        password,
    });
}

export function getUser() {
    return axios.get(API_URL+'api/confirm_auth')
}

export function apiLogout() {
    return axios.get(API_URL+'api/logout')
}

export function postFacebookResponse(response) {

}
