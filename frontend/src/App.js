
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import main from './assets/Main.svg';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';

function App() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/register');
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
              Welcome
            </button>
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default Main;
