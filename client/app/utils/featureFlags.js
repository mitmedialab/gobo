import { getQueryParam } from './url';

export const KEYWORD_FILTER = 'kwfilter';
export const SORT_VIRALITY = 'sort';
export const SCROLLY_TELLING = 'scrolly';


/**
 * QueryParams are the location.search part of the url (e.g. ft=experiment,toggle).
 *
 * Returns true if the feature is found (e.g. if "experiment" is found).
 */
export default function isEnabled(feature) {
  const features = getQueryParam('ft');
  if (features) {
    return features.split(',').indexOf(feature) > -1;
  }
  return false;
}
