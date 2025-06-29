import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./main.css";
import { AuthContextProvider } from "./auth/AuthContext.tsx";
import { ModalContextProvider } from "./context/ModalContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <ModalContextProvider>
          <App />
        </ModalContextProvider>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>
);
