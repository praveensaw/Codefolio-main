import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./Context/AuthProvider"
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </AuthProvider>
)
