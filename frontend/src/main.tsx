import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./main.css";
import { AuthContextProvider } from "./auth/AuthContext.tsx";
import { UserPreferencesContextProvider } from "./context/PreferencesContext.tsx";
import { ProfileContextProvider } from "./context/ProfileContext.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthContextProvider>
        <ProfileContextProvider>
          <UserPreferencesContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </UserPreferencesContextProvider>
        </ProfileContextProvider>
      </AuthContextProvider>
    </Provider>
  </StrictMode>
);
