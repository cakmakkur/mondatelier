import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./main.css";
import { AuthContextProvider } from "./auth/AuthContext.tsx";
import { UserPreferencesContextProvider } from "./context/UserPreferencesContext.tsx";
import { ProfileContextProvider } from "./context/ProfileContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <ProfileContextProvider>
        <UserPreferencesContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UserPreferencesContextProvider>
      </ProfileContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
