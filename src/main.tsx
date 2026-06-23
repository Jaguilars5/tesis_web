import "./app/styles/globals.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { sessionExpired } from "@features/auth/auth.slice";

import App from "./App";
import { store } from "./shared/redux/store";
import { setUnauthorizedHandler } from "./shared/services/api.client";

setUnauthorizedHandler(() => {
  store.dispatch(sessionExpired());

  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
