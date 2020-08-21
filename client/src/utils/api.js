import axios from "axios";
import { userOperations } from "../state/redux/user";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      userOperations.logout();
    }

    return Promise.reject(err);
  }
);

export const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common["x-auth-token"] = token;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["x-auth-token"];
    localStorage.removeItem("token");
  }
};

export const get = async (url, config = {}) => {
  const response = await api.get(url, { ...config, timeout: 10000 });
  return response;
};

export const post = async (url, data = {}, config = {}) => {
  const response = await api.post(url, data, { ...config, timeout: 10000 });
  return response;
};

export const del = async (url, config = {}) => {
  const response = await api.delete(url, { ...config, timeout: 10000 });
  return response;
};

export const put = async (url, data = {}, config = {}) => {
  const response = await api.put(url, data, { ...config, timeout: 10000 });
  return response;
};
