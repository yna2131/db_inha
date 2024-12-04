import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerstyle } from "../styles/RegisterStyle";

export function RegisterPage() {
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Saving...');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pseudo, email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Account created successfully!');
        navigate('/login');
      } else {
        setMessage(result.message || 'Error creating account.');
      }
    } catch (error) {
      setMessage('Error communicating with the server.');
      console.error(error);
    }
  };

  return (
    <>
      <main className="auth-container">
        <p className="auth-title">Create An Account</p>
        <p className="auth-link">
          Already have an account?{" "}
          <a href="/login" className="underline">Login</a>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="pseudo-input"
            className="auth-input"
            placeholder="Enter your pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            aria-label="Pseudo"
          />
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
          <input
            type="password"
            id="password-validation"
            className="auth-input"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-label="Confirm Password"
          />
          <button type="submit" className="auth-submit">
            REGISTER
          </button>
        </form>
        {message && <p>{message}</p>}
      </main>
      <style jsx>{registerstyle}</style>
    </>
  );
}

export default RegisterPage;
