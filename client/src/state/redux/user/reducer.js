import * as types from "./types";

/**
 * profile: {
 *   username: string
 * },
 * isAuthenticated: bool,
 * token: string,
 * errors: [{
 *  errorKey: string
 * }]
 */
const initialState = {
  profile: null,
  isAuthenticated: false,
  token: null,
  errors: {},
  isGuest: false,
  currentlyProcessing: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.SET_USER:
      return {
        ...state,
        profile: payload.user,
        token: payload.token,
        isAuthenticated: true,
        isGuest: false
      };
    case types.SET_GUEST:
      return {
        profile: {
          username: "Guest"
        },
        isAuthenticated: true,
        isGuest: true
      }
    case types.CLEAR_USER:
      return {
        ...state,
        profile: null,
        token: null,
        isAuthenticated: false,
        isGuest: false
      };
    case types.AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: true
      }
    case types.DEAUTHENTICATE:
      return {
        ...state,
        isAuthenticated: false,
        isGuest: false
      }
    case types.SET_USER_ERRORS:
      return {
        ...state,
        errors: payload
      }
    case types.CLEAR_ERRORS:
      return {
        ...state,
        errors: {}
      }
    case types.START_USER_ACTION:
      return {
        ...state,
        currentlyProcessing: true
      }
    case types.STOP_USER_ACTION:
      return {
        ...state,
        currentlyProcessing: false
      }
    default:
      return state;
  }
};
