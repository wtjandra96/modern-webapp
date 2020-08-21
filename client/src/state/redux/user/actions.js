import * as types from "./types";

const setUser = (user, token) => ({
  type: types.SET_USER,
  payload: { user, token }
});

const clearUser = () => ({
  type: types.CLEAR_USER
});

const authenticate = () => ({
  type: types.AUTHENTICATE
});

const deauthenticate = () => ({
  type: types.DEAUTHENTICATE
});

const setErrors = errorMessages => ({
  type: types.SET_USER_ERRORS,
  payload: errorMessages
});

const clearErrors = () => ({
  type: types.CLEAR_ERRORS
});

const setGuest = () => ({
  type: types.SET_GUEST
});

const startAction = () => ({
  type: types.START_USER_ACTION
});

const stopAction = () => ({
  type: types.STOP_USER_ACTION
});

export {
  setUser,
  setGuest,
  clearUser,
  authenticate,
  deauthenticate,
  setErrors,
  clearErrors,
  startAction,
  stopAction
};
