import * as types from "./types";

const setUser = (user, token) => ({
  type: types.SET_USER,
  payload: { user, token }
});

const clearUser = () => ({
  type: types.CLEAR_USER
})

const authenticate = () => ({
  type: types.AUTHENTICATE
});

const deauthenticate = () => ({
  type: types.DEAUTHENTICATE
});

const setErrors = errorMessages => ({
  type: types.SET_ERRORS,
  payload: errorMessages
})

const clearErrors = () => ({
  type: types.CLEAR_ERRORS
})

const setGuest = () => ({
  type: types.SET_GUEST
})

export {
  setUser,
  setGuest,
  clearUser,
  authenticate,
  deauthenticate,
  setErrors,
  clearErrors
};
