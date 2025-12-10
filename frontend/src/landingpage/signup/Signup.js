import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Signup() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:3002/signup",
      values,
      { withCredentials: true }
    );

    navigate("/login");
  };

  return (
    <div className="all">
      <div className="signup-container">
        <h2>Create your Stockers account</h2>
        <p className="signup-tagline">
          Invest in stocks, mutual funds and more with Stockers.
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email (for Stockers login)</label>
            <input
              type="email"
              placeholder="Enter your email address"
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Create a unique username"
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>

          <button className="signup-btn" type="submit">
            Open Stockers account
          </button>

          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
