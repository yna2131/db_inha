import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function MainPage() {
  const location = useLocation();
  const email = location.state?.email;
  const [pseudo, setPseudo] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (result.user) {
          setPseudo(result.user.pseudo);
        } else {
          setMessage('User not found.');
        }
      } catch (error) {
        setMessage('Error communicating with the server.');
        console.error(error);
      }
    };

    if (email) {
      fetchUser();
    } else {
      setMessage('Missing email.');
    }
  }, [email]);

  if (!email) {
    return <p>Error: Missing email.</p>;
  }

  return (
    <div>
      <h1>Main Page</h1>
      {message && <p>{message}</p>}
      {pseudo && <p>Welcome, <strong>{pseudo}</strong>!</p>}
    </div>
  );
}

export default MainPage;
