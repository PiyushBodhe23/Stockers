import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";

import Home from "./components/Home";
// Use RegisterSimple instead of Register if you don't have MUI
import Register from "./components/Register"; // Or RegisterSimple
import Login from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<h1 style={{color: "#eef2ff", background: "#0a0c10", padding: "20px"}}>404 Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);