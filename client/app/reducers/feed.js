import {
  GET_POSTS_LOAD,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAIL,
  GET_SETTINGS_LOAD,
  GET_SETTINGS_SUCCESS,
  GET_SETTINGS_FAIL,
  UPDATE_SETTINGS,
  FILTER_POSTS_SUCCESS,
  GET_RULES_LOAD,
  GET_RULES_SUCCESS,
  GET_RULES_FAIL,
  UPDATE_RULES,
  UPDATE_SHOW_PLATFORM,
} from 'actions/feed';

/* ------------------- */
// Define Default State
/* ------------------- */
const defaultState = {
  loading_posts: false,
  filtering_posts: false,
  get_posts_error: false,
  posts: [],
  loading_settings: false,
  get_settings_success: false,
  get_settings_error: false,
  settings: {
    include_corporate: false,
    gender_filter_on: false,
    virality_min: 0,
    virality_max: 1,
    gender_female_per: 50,
    rudeness_min: 0,
    rudeness_max: 1,
    seriousness_min: 0,
    seriousness_max: 1,
  },
  rules: [],
  showPlatform: 'all',
  loadingRules: false,
  getRulesSuccess: false,
  getRulesError: false,
  filtered_posts: {
    inFeedPosts: [],
    filtered: [],
    fb: 0,
    reasons: {},
  },
};

/* ----------------------------------------- */
// Bind actions to specific reducing functions
/* ----------------------------------------- */
export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case GET_POSTS_LOAD:
      return {
        ...state,
        loading_posts: true,
        filtering_posts: true,
      };
    case GET_POSTS_SUCCESS:
      return {
        ...state,
        posts: action.result.data.posts,
        loading_posts: false,
      };
    case GET_POSTS_FAIL:
      return {
        ...state,
        loading_posts: false,
        get_posts_error: true,
      };
    case GET_SETTINGS_LOAD:
      return {
        ...state,
        loading_settings: true,
      };
    case GET_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.result.data,
        loading_settings: false,
        get_settings_success: true,
      };
    case GET_SETTINGS_FAIL:
      return {
        ...state,
        loading_settings: false,
        get_settings_error: true,
        get_settings_success: false,
      };
    case UPDATE_SETTINGS:
      return {
        ...state,
        settings: action.settings,
        filtering_posts: true,
      };
    case FILTER_POSTS_SUCCESS:
      return {
        ...state,
        filtered_posts: action.result,
        filtering_posts: false,
      };
    case GET_RULES_LOAD:
      return {
        ...state,
        loadingRules: true,
      };
    case GET_RULES_SUCCESS:
      return {
        ...state,
        rules: action.result.data.rules,
        loadingRules: false,
        getRulesSuccess: true,
      };
    case GET_RULES_FAIL:
      return {
        ...state,
        loadingRules: false,
        getRulesError: true,
        getRulesSuccess: false,
      };
    case UPDATE_RULES:
      return {
        ...state,
        rules: action.rules,
        filtering_posts: true,
      };
    case UPDATE_SHOW_PLATFORM:
      return {
        ...state,
        showPlatform: action.showPlatform,
        filtering_posts: true,
      };
    default:
      return state;
  }
}
