import queryString from 'query-string';

export function getQueryParam(param) {
  const values = queryString.parse(window.location.search);
  return values[param];
}

export function encodeData(data) {
  return Object.keys(data).map(key => [key, data[key]].join('=')).join('&');
}
