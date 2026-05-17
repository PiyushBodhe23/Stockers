import React from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

const Home = () => {

  return (

    <Routes>

      {/* ================= PUBLIC ================= */}

      <Route
        path="/login"
        element={<Login />}
      />



      <Route
        path="/register"
        element={<Register />}
      />



      {/* ================= DEFAULT ================= */}

      <Route
        path="/"
        element={
          <Navigate to="/login" />
        }
      />



      {/* ================= PROTECTED ================= */}

      <Route

        path="/dashboard/*"

        element={

          <ProtectedRoute>

            <Dashboard />

          </ProtectedRoute>

        }

      />

    </Routes>
  );
};

export default Home;