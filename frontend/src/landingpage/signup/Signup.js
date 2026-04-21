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

    if (!values.email || !values.username || !values.password) {
      alert("All fields are required");
      return;
    }

    try {
      await axios.post(
        "https://localhost3001/register",
        values
      );

      navigate("/login");

    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="all">
      <div className="signup-container">
        <h2>Create your Stockers account</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) =>
              setValues({ ...values, email: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setValues({ ...values, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setValues({ ...values, password: e.target.value })
            }
          />

          <button type="submit">Sign Up</button>

          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;