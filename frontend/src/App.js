import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import main from './assets/Main.svg';
import RegisterPage from './RegisterPage';
import MainPage from './MainPage';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('Loading...');

    try {
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
    } catch (error) {
      setMessage('Error');
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            backgroundColor: '#1563B8',
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <img
            src={main}
            alt="main"
            style={{
              height: '30vh',
              width: 'auto',
              objectFit: 'contain',
              marginBottom: '20px',
            }}
          />
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your mail..."
              style={{
                padding: '10px',
                margin: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                width: '200px',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#1563B8',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
            <div style={{ marginTop: '20px', color: 'white' }}>{message}</div>
          </form>
        </div>
      </header>
    </div>
  );
}

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default Main;
