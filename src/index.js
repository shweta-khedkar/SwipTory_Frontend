import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/common/Layout/Layout.jsx";
import store from "./store.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Layout>
        <App />
      </Layout>
    </Provider>
  </BrowserRouter>
);
