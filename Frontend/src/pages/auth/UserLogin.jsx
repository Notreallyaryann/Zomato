import React from 'react';
import '../../styles/auth-shared.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const navigate = useNavigate();
  const [formError, setFormError] = React.useState("");

  function validateEmail(email) {
    // Simple email regex
    return /^\S+@\S+\.\S+$/.test(email);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!validateEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/user/login", {
        email,
        password
      }, { withCredentials: true });

      if (response.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/"); // Redirect to home after login
      } else {
        setFormError(response.data.message || "Invalid email or password.");
      }
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 401)) {
        setFormError("Invalid email or password.");
      } else {
        setFormError("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="user-login-title">
        <header>
          <h1 id="user-login-title" className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to continue your food journey.</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {formError && <div style={{color: '#dc2626', marginBottom: '12px', textAlign: 'center'}}>{formError}</div>}
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button className="auth-submit" type="submit">Sign In</button>
        </form>
        <div className="auth-alt-action">
          New here? <a href="/user/register">Create account</a>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;