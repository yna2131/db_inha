import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mainstyle } from "../styles/MainStyle";

function MainPage() {
  const location = useLocation();
  const email = location.state?.email;
  const [pseudo, setPseudo] = useState('');
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/posts');
        const result = await response.json();
        setPosts(result);
      } catch (error) {
        setMessage('Error fetching posts.');
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  if (!email) {
    return <p>Error: Missing email.</p>;
  }

  const createPost = async () => {
    try {
      const response = await fetch('/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Post by ${pseudo || 'User'}`,
          content: 'This is a new post.',
        }),
      });

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
    } catch (error) {
      setMessage('Error creating post.');
      console.error(error);
    }
  };

  return (
    <div style={mainstyle.mainContainer}>
      <header style={mainstyle.header}>
        <p>Welcome, <strong>{pseudo || 'User'}</strong>!</p>
      </header>
      <div style={mainstyle.categoriesContainer}>
        {['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5'].map((category, index) => (
          <div key={index} style={mainstyle.categoryBox}>
            {category}
          </div>
        ))}
      </div>
      <div style={mainstyle.postsContainer}>
        {posts.map((post, index) => (
          <div key={post.id} style={mainstyle.postBox}>
            {post.title}
          </div>
        ))}
      </div>
      <button 
        onClick={createPost}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#1563B8',
          color: 'white',
          fontSize: '30px',
          border: 'none',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        +
      </button>
    </div>
  );
}

export default MainPage;
