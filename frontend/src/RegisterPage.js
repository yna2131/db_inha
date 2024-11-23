import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Retrieve the email passed via navigate
  const [pseudo, setPseudo] = useState('');
  const [message, setMessage] = useState('');

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
        navigate('/main', { state: { email } });
      } else {
        setMessage('Error while saving pseudo.');
      }
    } catch (error) {
      setMessage('Error communicating with the server.');
      console.error(error);
    }
  };

  if (!email) {
    return <p>Error: Missing email.</p>;
  }

  return (
    <div>
      <h1>Set Your Pseudo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
        <button type="submit">Save</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterPage;
