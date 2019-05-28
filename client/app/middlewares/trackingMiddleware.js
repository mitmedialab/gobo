import {
  TOGGLE_FILTERED_ONLY,
  UPDATE_SHOW_PLATFORM,
  RULE_CHANGED,
  OPEN_MODAL,
} from 'actions/feed';

import {
  FLIP_TOGGLE,
  HIDDEN_TOGGLE,
} from 'actions/post';

import ReactGA from 'react-ga';

function cleanName(name) {
  const lower = name.toLowerCase();
  return lower.split(' ').join('-');
}

function buildCategory(domain, component, ui) {
  return [cleanName(domain), cleanName(component), cleanName(ui)].join('.');
}

function trackEvent(domain, component, ui, action, label) {
  ReactGA.event({
    category: buildCategory(domain, component, ui),
    action,
    label,
  });
}

const trackingMiddleware = store => next => (action) => {
  const isTracking = !store.getState().auth.user || !store.getState().auth.user.hide_tracking;
  if (isTracking) {
    switch (action.type) {
      case TOGGLE_FILTERED_ONLY:
        trackEvent('feed', 'toggle-hidden', 'button', 'clicked', action.showFilteredOnly ? 'hidden' : 'feed');
        break;
      case UPDATE_SHOW_PLATFORM:
        trackEvent('feed', 'platform', 'select', 'clicked', action.showPlatform);
        break;
      case FLIP_TOGGLE:
        trackEvent('post', 'flip', 'button', 'clicked', action.flipped ? 'reasons' : 'content');
        break;
      case HIDDEN_TOGGLE:
        trackEvent('post', 'hidden', 'button', 'clicked', action.hidden ? 'collapsed' : 'expanded');
        break;
      case RULE_CHANGED:
        trackEvent('rule', action.rule, action.component, 'clicked', `${action.value}`);
        break;
      case OPEN_MODAL:
        trackEvent('rule', action.rule, 'modal', 'clicked', action.value);
        break;
      default:
        break;
    }
  }

  return next(action);
};

export default trackingMiddleware;
