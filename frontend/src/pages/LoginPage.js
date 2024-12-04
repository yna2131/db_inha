import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerstyle } from "../styles/RegisterStyle";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Logging in...');

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Login successful!');
        navigate('/main', { state: { email, userId: result.userId, token: result.token } });
      } else {
        setMessage(result.message || 'Invalid email or password.');
      }
    } catch (error) {
      setMessage('Error communicating with the server.');
      console.error(error);
    }
  };

  return (
    <>
      <main className="auth-container">
        <p className="auth-title">Login into your Account</p>
        <p className="auth-link">
          You don't have an account?{" "}
          <a href="/register" className="underline">Register</a>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email-input"
            className="auth-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email"
          />
          <input
            type="password"
            id="password-input"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          <button type="submit" className="auth-submit">
            LOGIN
          </button>
        </form>
        {message && <p>{message}</p>}
      </main>
      <style jsx>{registerstyle}</style>
    </>
  );
}

export default LoginPage;
