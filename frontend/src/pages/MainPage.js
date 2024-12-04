import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { mainstyle } from "../styles/MainStyle";
import { CreatePostModal } from "../components/CreatePostModal";

function MainPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const user_id = location.state?.userId;
  const [pseudo, setPseudo] = useState("");
  const [, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/users/username/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (result.username) {
          setPseudo(result.username);
        } else {
          setMessage("User not found.");
        }
      } catch (error) {
        setMessage("Error communicating with the server.");
        console.error(error);
      }
    };

    if (email) {
      fetchUser();
    } else {
      setMessage("Missing email.");
    }
  }, [email]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, 
          },
        });

        const result = await response.json();
        setPosts(result);
      } catch (error) {
        setMessage("Error fetching posts.");
        console.error(error);
      }
    };

    fetchPosts();
  }, []);

  const createPost = async (title, content) => {
    try {
      const response = await fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
          user_id: user_id,
        }),
      });

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
    } catch (error) {
      setMessage("Error creating post.");
      console.error(error);
    }
  };

  if (!email) {
    return <p>Error: Missing email.</p>;
  }

  return (
    <div style={mainstyle.mainContainer}>
      <header style={mainstyle.header}>
        <p>
          Welcome, <strong>{pseudo || "User"}</strong>!
        </p>
      </header>
      <div style={mainstyle.categoriesContainer}>
        {["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"].map((category, index) => (
          <div key={index} style={mainstyle.categoryBox}>
            {category}
          </div>
        ))}
      </div>
      <div style={mainstyle.postsContainer}>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={mainstyle.postBox}
              onClick={() =>
                navigate(`/post/${post.id}`, {
                  state: { userId: user_id, pseudo: pseudo },
                })
              }
            >
              <p style={mainstyle.postContent}>{post.username}</p>
              <h3 style={mainstyle.postTitle}>{post.title}</h3>
              <p style={mainstyle.postContent}>{post.content}</p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#1563B8",
          color: "white",
          fontSize: "30px",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        +
      </button>

      {isModalOpen && (
        <CreatePostModal onClose={() => setIsModalOpen(false)} onSubmit={createPost} />
      )}
    </div>
  );
}

export default MainPage;
