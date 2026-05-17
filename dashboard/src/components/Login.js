import React, {
    useState,
} from "react";

import axios from "axios";

import {
    useNavigate,
    Link,
} from "react-router-dom";

import "./Auth.css";

const Login = () => {

    const navigate =
        useNavigate();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const handleLogin =
        async (e) => {

            e.preventDefault();

            try {

                const res =
                    await axios.post(
                        "http://localhost:3002/login",
                        {
                            email,
                            password,
                        }
                    );

                localStorage.setItem(
                    "token",
                    res.data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(res.data.user)
                );

                navigate("/dashboard");

            } catch (err) {

                console.log(err.response.data);

                setError(
                    err.response?.data?.message ||
                    "Login Failed"
                );

            }
        };



    return (

        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back</h1>

                <p>
                    Login to access your trading dashboard
                </p>



                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />



                    <input
                        type="password"
                        placeholder="Password"
                        required
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />



                    {error && (
                        <p className="error-text">
                            {error}
                        </p>
                    )}



                    <button type="submit">
                        Login
                    </button>

                </form>



                <p className="auth-switch">

                    Don't have an account?

                    <Link to="/register">
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
};

export default Login;