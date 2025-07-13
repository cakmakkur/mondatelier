import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./main.css";
import { AuthContextProvider } from "./auth/AuthContext.tsx";
import { ModalContextProvider } from "./context/ModalContext.tsx";
import { UserPreferencesContextProvider } from "./context/UserPreferencesContext.tsx";
import { CookieContextProvider } from "./context/CookiesContext.tsx";
import { ProfileContextProvider } from "./context/ProfileContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <CookieContextProvider>
        <ProfileContextProvider>
          <UserPreferencesContextProvider>
            <BrowserRouter>
              <ModalContextProvider>
                <App />
              </ModalContextProvider>
            </BrowserRouter>
          </UserPreferencesContextProvider>
        </ProfileContextProvider>
      </CookieContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
