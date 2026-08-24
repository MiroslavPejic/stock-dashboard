import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Login.css";


function Login() {

  const navigate = useNavigate();

  const { signIn } = useAuth();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    setLoading(true);


    const {
      error,
    } = await signIn(
      email,
      password
    );


    if (error) {

      setError(error.message);

      setLoading(false);

      return;
    }


    navigate("/");

    setLoading(false);
  };


  return (

    <main className="auth-page">

      <div className="auth-card">

        <h1>
          Welcome back
        </h1>

        <p className="auth-description">
          Log in to access your personalised
          Stock Dashboard.
        </p>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              placeholder="you@example.com"
            />

          </div>


          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              placeholder="Your password"
            />

          </div>


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Log in"}

          </button>

        </form>


        <p className="auth-footer">

          Don't have an account?{" "}

          <Link to="/signup">
            Create one
          </Link>

        </p>

      </div>

    </main>
  );
}


export default Login;