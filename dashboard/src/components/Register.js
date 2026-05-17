import React, {
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import "./Auth.css";

const Register = () => {

  const navigate =
    useNavigate();

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");



  const handleRegister =
    async (e) => {

      e.preventDefault();
      try {
        await axios.post(
          "https://stockersbackend.vercel.app/register",
          {
            username,
            email,
            password,
          }
        );
        navigate("/login");

      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Registration Failed"
        );
      }
    };



  return (

    <div className="auth-page">

      <div className="auth-card">

        <h1>Create Account</h1>

        <p>
          Register to start trading
        </p>



        <form onSubmit={handleRegister}>

          <input
            type="text"
            placeholder="Username"
            required
            onChange={(e) =>
              setUsername(
                e.target.value
              )
            }
          />

          <input
            type="email"
            placeholder="Email"
            required
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}

          <button type="submit">

            Register

          </button>

        </form>



        <p className="auth-switch">

          Already have an account?

          <Link to="/login">

            Login

          </Link>

        </p>

      </div>

    </div>
  );
};

export default Register;
