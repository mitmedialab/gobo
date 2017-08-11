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

export function postFacebookResponseToServer(response) {
    return axios.post(API_URL+'api/handle_facebook_response', {'facebook_response': response})
}

export function getTwitterAuthURl() {
    return axios.get(API_URL+'api/get_twitter_oauth_token')
}

export function waitTwitterCallback() {
    return axios.get(API_URL+'api/wait_for_twitter_callback')
}

export function postTwitterCallback(query) {
    return axios.post(API_URL+'api/handle_twitter_callback', query)
}

export function getUserPosts() {
    return axios.get(API_URL+'api/get_posts')
}

export function getFacebookAppId() {
    return axios.get(API_URL+'api/get_facebook_app_id')
}