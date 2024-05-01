import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASEURL from "../BASEURL.js";
import {
  createStoryRequest,
  createStorySuccess,
  createStoryFailure,
  getStoriesRequest,
  getStoriesSuccess,
  getStoriesFailure,
  getBookmarksRequest,
  getBookmarksSuccess,
  getBookmarksFailure,
  fetchStoryRequest,
  fetchStorySuccess,
  fetchStoryFailure,
  bookmarkRequest,
  bookmarkSuccess,
  bookmarkFailure,
  likeSuccess,
  likeRequest,
  likeFailure,
  getStoryByUserRequest,
  getStoryByUserSuccess,
  getStoryByUserFailure,
  getCategoryStoriesSuccess,
  getCategoryStoriesFailure,
  getCategoryStoriesRequest,
} from "./storySlice.js";

axios.defaults.baseURL = BASEURL;
axios.defaults.withCredentials = true;

//Create Story
export const createStory = (values) => async (dispatch) => {
  try {
    dispatch(createStoryRequest());
    const { data } = await axios.post(`/story/create`, values);
    dispatch(createStorySuccess(data));
    toast.success("Story created successfully", { position: "bottom-right" });
  } catch (error) {
    dispatch(createStoryFailure());
    toast.error(error.response.data, { position: "bottom-right" });
  }
};

//Fetch Stories
export const getStories = (page, catLimit, cat) => async (dispatch) => {
  try {
    if (page === null) {
      page = 1;
    }
    if (catLimit === null) {
      catLimit = 4;
    }
    if (cat === null) {
      cat = "All";
    }
    dispatch(getStoriesRequest());
    const { data } = await axios.get(
      `/story/getAll?category=All&page=${page}&catLimit=${catLimit}&cat=${cat}`
    );
    dispatch(getStoriesSuccess(data));
  } catch (error) {
    dispatch(getStoriesFailure());

    toast.error(error.response.data);
  }
};

//Fetch Story
const getApiURL = (url, category) => {
  if (category) {
    url += `&category=${category}`;
  }
  return url;
};

export const getStory = (storyId, userId, category) => async (dispatch) => {
  try {
    dispatch(fetchStoryRequest());
    if (userId == null) {
      //get story for not authenicated users
      const { data } = await axios.get(`/story/getById/${storyId}`);
      dispatch(fetchStorySuccess(data));
    } else {
      // get story for authenticated users to check liked/bookmarked or not
      const { data } = await axios.get(
        getApiURL(`/story/getById/${storyId}?userId=${userId}`, category)
      );
      dispatch(fetchStorySuccess(data));
    }
  } catch (error) {
    dispatch(fetchStoryFailure());
    toast.error(error);
  }
};

//Fetch Story by User
export const getStoriesByUser =
  (userId, userStoriesPage) => async (dispatch) => {
    try {
      if (userStoriesPage === null) {
        userStoriesPage = 1;
      }
      dispatch(getStoryByUserRequest());
      const { data } = await axios.get(
        `/story/getAll?userId=${userId}&page=${userStoriesPage}`
      );
      dispatch(getStoryByUserSuccess(data));
    } catch (error) {
      dispatch(getStoryByUserFailure());
      toast.error(error.response.data);
    }
  };

//Story by catagory
export const getStoriesByCategory = (category, page) => async (dispatch) => {
  try {
    if (page === null) {
      page = 1;
    }
    dispatch(getCategoryStoriesRequest());
    const { data } = await axios.get(
      `/story/getAll?category=${category}&page=${page}`
    );
    dispatch(getCategoryStoriesSuccess(data));
  } catch (error) {
    dispatch(getCategoryStoriesFailure());
    toast.error(error.response.data);
  }
};

//Like Story
export const likeStory = (id, userId, state) => async (dispatch) => {
  try {
    dispatch(likeRequest());
    const { data } = await axios.put(`/story/like/${id}`, {
      userId: userId,
    });
    dispatch(likeSuccess(!state));
    toast.success(data.message, { position: "bottom-right" });
  } catch (error) {
    dispatch(likeFailure(false));
    toast.error(error.response.data.message, { position: "bottom-right" });
  }
};
//Get Bookmarks
export const getBookmarks = (userId) => async (dispatch) => {
  try {
    dispatch(getBookmarksRequest());
    const { data } = await axios.get(`/user/bookmarks/${userId}`);
    dispatch(getBookmarksSuccess(data.bookmarks));
  } catch (error) {
    dispatch(getBookmarksFailure());
    toast.error(error.response.data);
  }
};

//Bookmark story
export const bookmarkStory = (id, userId, state) => async (dispatch) => {
  try {
    dispatch(bookmarkRequest());
    const { data } = await axios.post(`/user/bookmark/${id}`, {
      userId: userId,
    });
    dispatch(bookmarkSuccess(!state));
    toast.success(data.message, { position: "bottom-right" });
  } catch (error) {
    dispatch(bookmarkFailure(false));
    toast.error(error.response.data.message, { position: "bottom-right" });
  }
};
