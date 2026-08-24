import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Signup.css";


function Signup() {

  const navigate = useNavigate();

  const { signUp } = useAuth();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");

    setMessage("");

    setLoading(true);


    const {
      data,
      error,
    } = await signUp(
      email,
      password
    );


    if (error) {

      setError(error.message);

      setLoading(false);

      return;
    }


    /*
     * If email confirmation is enabled,
     * Supabase will normally return a user
     * but no active session.
     */

    if (data.user && !data.session) {

      setMessage(
        "Account created. Please check your email to confirm your account."
      );

    } else {

      navigate("/");

    }


    setLoading(false);
  };


  return (

    <main className="auth-page">

      <div className="auth-card">

        <h1>
          Create your account
        </h1>

        <p className="auth-description">
          Create an account to save your
          favourite stocks and personalise
          your dashboard.
        </p>


        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}


        {message && (
          <div className="auth-message">
            {message}
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
              minLength={6}
              placeholder="At least 6 characters"
            />

          </div>


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >

            {loading
              ? "Creating account..."
              : "Create account"}

          </button>

        </form>


        <p className="auth-footer">

          Already have an account?{" "}

          <Link to="/login">
            Log in
          </Link>

        </p>

      </div>

    </main>
  );
}


export default Signup;