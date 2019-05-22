export const FLIP_TOGGLE = 'post/FLIP_TOGGLE';
export const HIDDEN_TOGGLE = 'post/HIDDEN_TOGGLE';

export function toggleHidden(hidden) {
  return (dispatch) => {
    dispatch({ type: HIDDEN_TOGGLE, hidden });
  };
}

export function toggleFlip(flipped) {
  return (dispatch) => {
    dispatch({ type: FLIP_TOGGLE, flipped });
  };
}
