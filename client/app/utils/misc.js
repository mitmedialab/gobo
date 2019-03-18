import moment from 'moment';

export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];
    return reducer
      ? reducer(state, action.payload)
      : state;
  };
}

export function parseJSON(response) {
  return response.data;
}

export function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function makeClassList(classDict) {
  const list = Object.keys(classDict).reduce((acc, cur) => acc + (classDict[cur] ? `${cur} ` : ''), '');
  return list;
}

export function countCapitals(value) {
  const str = value;
  return str.replace(/[^A-Z]/g, '').length;
}

export function countNumbers(value) {
  return /\d/.test(value);
}

export function cloneDeep(obj) {
  let copy;
  // Handle the 3 simple types, and null or undefined
  if ((obj === null) || (typeof obj !== 'object')) return obj;
  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (let i = 0, len = obj.length; i < len; i += 1) {
      copy[i] = cloneDeep(obj[i]);
    }
    return copy;
  }
  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    Object.keys(obj).forEach((attr) => {
      if (Object.prototype.hasOwnProperty.call(obj, attr)) copy[attr] = cloneDeep(obj[attr]);
    });
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
}

export function formatNumber(num) {
  if (num === 0) {
    return '';
  }
  return num > 999 ? `${(num / 1000).toFixed(1)}k` : num;
}

export function getPostDateString(post) {
  const date = post.created_at || post.content.created_at || post.content.created_time;
  const dateMoment = moment(date);
  const now = moment();
  if (dateMoment.isAfter(now.subtract(24, 'hours'))) {
    return dateMoment.fromNow();
  }
  return dateMoment.format('MMM D [at] H:mma');
}

export function getSourceIcon(platform) {
  const icons = {
    twitter: 'icon-twitter-squared',
    facebook: 'icon-facebook-squared',
    mastodon: 'icon-mastodon',
  };
  return icons[platform];
}
