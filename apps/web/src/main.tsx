import React from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/nunito-sans";
import { App } from "./App";
import "./styles.css";
import { AuthProvider } from "./features/auth/AuthProvider";
import { AppErrorBoundary } from "./components/AppErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppErrorBoundary>
  </React.StrictMode>,
);
