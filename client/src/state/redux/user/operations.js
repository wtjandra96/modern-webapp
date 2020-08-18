import * as api from "../../../utils/api";
import * as actions from "./actions";
import { clearPosts } from "../post/actions";
import { clearCategoriesList } from "../category/actions";

const register = (username, password) => async dispatch => {
  const { setErrors, clearErrors } = actions;
  dispatch(clearErrors());

  const url = "/auth/register";
  const data = { username, password };

  try {
    await api.post(url, data);
  } catch (err) {

    if (err.response.data && err.response.data.errors) {
      const errorMessages = err.response.data.errors;
      dispatch(setErrors(errorMessages));
    } else {
      console.error(err);
    }
  }
};

const login = (username, password) => async dispatch => {
  const { setUser, setErrors, clearErrors } = actions;
  dispatch(clearErrors());

  const url = "/auth/login";
  const data = { username, password };

  try {
    const res = await api.post(url, data);
    const { user, token } = res.data;
    api.setAuthToken(token);
    dispatch(setUser(user, token));
  } catch (err) {

    if (err.response.data && err.response.data.errors) {
      const errorMessages = err.response.data.errors;
      dispatch(setErrors(errorMessages));
    } else {
      console.error(err);
    }
  }
};

const guestLogin = () => async dispatch => {
  const { setGuest, clearErrors } = actions;
  dispatch(clearErrors());
  dispatch(setGuest());
}

const logout = () => async dispatch => {
  const { clearUser } = actions;
  dispatch(clearUser());
  dispatch(clearPosts());
  dispatch(clearCategoriesList());
  api.setAuthToken(null);
};

const changePassword = (oldPassword, newPassword) => async dispatch => {
  const { setErrors, clearErrors } = actions;
  dispatch(clearErrors());

  const url = "/auth/changePassword";
  const data = { oldPassword, newPassword };

  try {
    await api.post(url, data);
  } catch (err) {
    if (err.response.data && err.response.data.errors) {
      const errorMessages = err.response.data.errors;
      dispatch(setErrors(errorMessages));
    } else {
      console.error(err);
    }
  }
}

const softLogout = () => async dispatch => {
  const { deauthenticate } = actions;
  dispatch(deauthenticate());
}

const loadUser = token => async dispatch => {
  const { authenticate } = actions;
  api.setAuthToken(token);
  dispatch(authenticate());
}

export {
  register,
  login,
  guestLogin,
  logout,
  softLogout,
  loadUser,
  changePassword
};
