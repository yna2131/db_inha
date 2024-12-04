import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatePostModal } from "../components/CreatePostModal";
import { mainstyle } from "../styles/MainStyle";

function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: "", email: "", username: "" });
  const [, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/users/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const result = await response.json();
      setUser(result);
    } catch (error) {
      setMessage("Error communicating with the server.");
      console.error(error);
    }
  };

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

  useEffect(() => {
    fetchUser();
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
        }),
      });

      const newPost = await response.json();
      const updatedPosts = {
        ...newPost,
        user: { username: user.username },
      };
      setPosts([updatedPosts, ...posts]);
    } catch (error) {
      setMessage("Error creating post.");
      console.error(error);
    }
  };

  return (
    <div style={mainstyle.mainContainer}>
      <header style={mainstyle.header}>
        <p>
          Welcome<strong>{user.username ? `, ${user.username}` : ""}</strong>!
        </p>
      </header>
      <div style={mainstyle.categoriesContainer}>
        {[
          "Category 1",
          "Category 2",
          "Category 3",
          "Category 4",
          "Category 5",
        ].map((category, index) => (
          <div key={`category-${index}`} style={mainstyle.categoryBox}>
            {category}
          </div>
        ))}
      </div>
      <div style={mainstyle.postsContainer}>
        {posts.length === 0 ? (
          <p>No posts available.</p>
        ) : (
          posts.map((post, index) => (
            <div
              key={`post-${post.id}`}
              style={mainstyle.postBox}
              onClick={() =>
                navigate(`/post/${post.id}`, {
                  state: { username: post.user.username },
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
        <CreatePostModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={createPost}
        />
      )}
    </div>
  );
}

export default MainPage;
