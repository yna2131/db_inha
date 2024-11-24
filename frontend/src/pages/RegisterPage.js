import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DateInput } from "../components/DateInput";
import { registerstyle } from "../styles/RegisterStyle";

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state?.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Saving...');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    const response = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (result.exists) {
      navigate('/login', { state: { email } });
    } else {
      navigate('/register', { state: { email } });
    }
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
        const passwordResponse = await fetch('/users/set-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const passwordResult = await passwordResponse.json();
        if (passwordResult.success) {
          setMessage('Account created successfully!');
          navigate('/main', { state: { email } });
        } else {
          setMessage('Error saving password.');
        }
      } else {
        setMessage('Error saving pseudo.');
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
