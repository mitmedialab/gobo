import queryString from 'query-string';

/**
 * QueryParams are the location.search part of the url (e.g. ft=experiment,toggle).
 *
 * Returns true if the feature is found (e.g. if "experiment" is found).
 */
export default function isEnabled(feature) {
  const values = queryString.parse(window.location.search);
  const features = values.ft;
  if (features) {
    return features.split(',').indexOf(feature) > -1;
  }
  return false;
}
