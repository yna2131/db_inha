import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { DateInput } from "../components/DateInput";
import { registerstyle } from "../styles/RegisterStyle";

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state?.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Saving...');

    try {
      const response = await fetch('/users/set-pseudo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, pseudo }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('Pseudo saved successfully!'); 
        navigate('/login', { state: { email } });
      } else {
        setMessage('Error while saving pseudo.');
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
          <div className="birth-date-container">
            <DateInput type="year" />
            <DateInput type="month" />
            <DateInput type="day" />
          </div>
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
            aria-label="Password"
          />
          <input
            type="password"
            id="password-validation"
            className="auth-input"
            placeholder="Confirm Password"
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
