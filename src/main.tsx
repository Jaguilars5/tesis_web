import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./app/styles/globals.css";
import { sessionExpired } from "./features/auth/reducers/auth.reducer";
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
