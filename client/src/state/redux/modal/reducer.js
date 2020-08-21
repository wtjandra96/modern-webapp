import * as types from "./types";

/**
 * showingOverlay: bool
 */
const initialState = {
  showingOverlay: false
};

export default (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case types.OPEN_MODAL:
      return {
        ...state,
        showingOverlay: true
      };
    case types.CLOSE_MODAL:
      return {
        ...state,
        showingOverlay: false
      };
    default:
      return state;
  }
};
