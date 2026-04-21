import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.email || !values.password) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axios.post(
        "https://localhost3002/login",
        values
      );

      // ✅ store token
      localStorage.setItem("token", res.data.token);

      // ✅ navigate inside app
      navigate("/dashboard");

    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="all">
      <div className="login-container">
        <h2>Login to Stockers</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setValues({ ...values, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setValues({ ...values, password: e.target.value })
            }
          />

          <button type="submit">Login</button>
        </form>

        <div className="signup-msg">
          New to Stockers? <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;