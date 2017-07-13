const url = ''//http://localhost:5000/'

import axios from 'axios';

export function register(email, password) {
    return axios.post(url+'api/register', {
        email,
        password,
    });
}

export function login(email, password) {
    return axios.post(url+'api/login', {
        email,
        password,
    });
}

export function getUser() {
    return axios.get(url+'api/confirm_auth')
}

export function apiLogout() {
    return axios.get(url+'api/logout')
}
