import axios from "axios";
import { toast } from "react-toastify";
import BASEURL from "../BASEURL";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  loadUserSuccess,
  loadUserRequest,
  loadUserFailure,
} from "./authSlice";
import { getStoriesByUser } from "./storyAPI";

axios.defaults.baseURL = BASEURL;

axios.defaults.withCredentials = true;

// Register User

export const register = (values) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const { data } = await axios.post(`/user/register`, values, {
      withCredentials: true,
    });
    dispatch(registerSuccess(data));
    localStorage.setItem("username", JSON.stringify(data.username));
    toast.success("Register Successful", {
      position: "bottom-right",
      autoClose: 500,
    });
  } catch (error) {
    dispatch(registerFailure(error.response.data));
    //console.log("error", error.response.data);
  }
};

// Login User

export const login = (values) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(`/user/login`, values, {
      withCredentials: true,
    });

    dispatch(loginSuccess(data));

    dispatch(getStoriesByUser(data.userId));
    localStorage.setItem("username", JSON.stringify(data.username));
  } catch (error) {
    dispatch(loginFailure(error.response.data));
    //console.log("error", error.response.data);
  }
};

//Get User

export const loadUser = () => async (dispatch) => {
  const username = JSON.parse(localStorage.getItem("username"));
  try {
    dispatch(loadUserRequest());

    const { data } = await axios.post(`/user/getUser/${username}`);

    dispatch(loadUserSuccess(data));

    toast.success(`${username} Login Successfully`, {
      position: "bottom-right",
      autoClose: 500,
    });
  } catch (error) {
    dispatch(loadUserFailure());
    //toast.error(error.response.data);
  }
};

// Logout User

export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());
    await axios.post(`/user/logout`, { withCredentials: true });

    dispatch(logoutSuccess());

    localStorage.removeItem("username");
    toast.success("Logout Successful", {
      position: "bottom-right",
      autoClose: 1000,
    });
  } catch (error) {
    dispatch(logoutFailure(error.response.data));
    toast.error(error.response.data);
  }
};
