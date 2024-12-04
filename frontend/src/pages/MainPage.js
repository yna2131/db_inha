import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateModal } from "../components/CreateModal";
import { mainstyle } from "../styles/MainStyle";

function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: "", email: "", username: "" });
  const [, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("post"); // Add modalType to differentiate between post and category

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

  const fetchCategories = async () => {
    try {
      const response = await fetch("/categories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const result = await response.json();
      setCategories(result);
    } catch (error) {
      setMessage("Error fetching categories.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
    fetchCategories();
  }, []);

  const createPost = async (data) => {
    const { field1: title, field2: content } = data; // Adjust to handle modal data structure
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

  const createCategory = async (data) => {
    const { field1: name, field2: description } = data; // Adjust to handle modal data structure
    try {
      const response = await fetch("/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          name: name,
          description: description,
        }),
      });

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
    } catch (error) {
      setMessage("Error creating category.");
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
        {categories.length === 0 ? (
          <p>No categories available.</p>
        ) : (
          categories.map((category, index) => (
            <div
              key={`category-${index}`}
              style={mainstyle.categoryBox}
              onClick={() => navigate(`/category/${category.id}`)} // Redirect to CategoryPostsPage
            >
              <h4>{category.name}</h4>
            </div>
          ))
        )}
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
        onClick={() => {
          setModalType("post"); // Set modal type to 'post' for creating posts
          setIsModalOpen(true);
        }}
        style={{
          position: "fixed",
          bottom: "80px",
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

      <button
        onClick={() => {
          setModalType("category"); // Set modal type to 'category' for creating categories
          setIsModalOpen(true);
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#D84A4A",
          color: "white",
          fontSize: "20px",
          border: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        C
      </button>

      {isModalOpen && (
        <CreateModal
          type={modalType} // Pass the type ('post' or 'category') to the modal
          onClose={() => setIsModalOpen(false)}
          onSubmit={modalType === "post" ? createPost : createCategory}
        />
      )}
    </div>
  );
}

export default MainPage;
