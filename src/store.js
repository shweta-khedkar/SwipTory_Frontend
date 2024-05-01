import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./API/authSlice.js";
import modalSlice from "./components/Modal/modalSlice.js";
import storyReducer from "./API/storySlice.js";
import layoutReducer from "./components/common/Layout/LayoutSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    modal: modalSlice,
    story: storyReducer,
    layout: layoutReducer,
  },
});

export default store;
