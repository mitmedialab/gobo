import createLogger from 'redux-logger';
import { Map } from 'immutable';

// Redux logger
const logger = createLogger({
  // State transformer
  // transforms Immutable maps from reducers
  // to the plain JS objects
  stateTransformer: (state) => {
    const newState = {};

    Object.keys(state).forEach((key) => {
      const stateItem = state[key];

      if (Map.isMap(stateItem)) {
        newState[key] = stateItem.toJS();
      } else {
        newState[key] = stateItem;
      }
    });

    return newState;
  },
});

export default logger;
