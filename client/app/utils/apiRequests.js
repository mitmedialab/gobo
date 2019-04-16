import { API_URL } from 'constants/index';

import axios from 'axios';

export function register(email, password) {
  return axios.post(`${API_URL}api/register`, {
    email,
    password,
  });
}

export function login(email, password) {
  return axios.post(`${API_URL}api/login`, {
    email,
    password,
  });
}

export function getUser() {
  return axios.get(`${API_URL}api/confirm_auth`);
}

export function getUserRules() {
  return axios.get(`${API_URL}api/get_rules`);
}

export function updateUserRules(rules) {
  return axios.post(`${API_URL}api/toggle_rules`, {
    rules,
  });
}

export function apiLogout() {
  return axios.get(`${API_URL}api/logout`);
}

export function postFacebookResponseToServer(response) {
  return axios.post(`${API_URL}api/handle_facebook_response`, {
    facebook_response: response,
  });
}

export function getTwitterAuthURl() {
  return axios.get(`${API_URL}api/get_twitter_oauth_token`);
}

export function waitTwitterCallback() {
  return axios.get(`${API_URL}api/wait_for_twitter_callback`);
}

export function postTwitterCallback(query) {
  return axios.post(`${API_URL}api/handle_twitter_callback`, query);
}

export function getUserPosts() {
  return axios.get(`${API_URL}api/get_posts`);
}

export function getUserSettings() {
  return axios.get(`${API_URL}api/get_settings`);
}
export function updateUserSettings(settings) {
  return axios.post(`${API_URL}api/update_settings`, { settings });
}

export function getFacebookAppId() {
  return axios.get(`${API_URL}api/get_facebook_app_id`);
}

export function getMastodonVerification() {
  return axios.get(`${API_URL}api/verify_mastodon`);
}

export function postMastodonDomain(domain) {
  return axios.post(`${API_URL}api/mastodon_domain`, { domain });
}

export function postMastodonToken(query) {
  return axios.post(`${API_URL}api/mastodon_token`, query);
}

export function getLockStatusFromServer() {
  return axios.get(`${API_URL}api/is_locked_with_password`);
}

export function verifyPassword(password) {
  return axios.post(`${API_URL}api/verify_beta_password`, { password });
}

export function deleteAccount() {
  return axios.get(`${API_URL}api/delete_acct`);
}

export function emailResetPassword(email) {
  return axios.post(`${API_URL}api/email_reset_password`, {
    email,
  });
}

export function updatePassword(token, password) {
  return axios.post(`${API_URL}api/reset_password`, {
    token,
    password,
  });
}
