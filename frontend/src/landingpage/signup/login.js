import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

function Login() {

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

 const handleSubmit = async (e) => {
  e.preventDefault();
  await axios.post("http://localhost:3002/login", values, { withCredentials: true });
  window.location.href = "http://localhost:3001";
};

  return (
    <div class="all">
    <div className="login-container">
      <h2>Login to Stockers</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setValues({ ...values, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setValues({ ...values, password: e.target.value })}
        />

        <button title="onSubmit">Login</button>
      </form>

      <div className="signup-msg">
        New to Stockers? <Link to="/signup">Create Account</Link>
      </div>
    </div>
    </div>
  );
}

export default Login;
