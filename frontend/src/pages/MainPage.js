import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateModal } from "../components/CreateModal";
import { mainstyle } from "../styles/MainStyle";

function MainPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: "", email: "", username: "" });
  const [, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("post");

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
      console.log("result", result);
    } catch (error) {
      setMessage("Error communicating with the server.");
      console.error("Fetch User Error:", error);
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
      if (Array.isArray(result)) {
        setPosts(result);
      } else {
        console.error("Unexpected response for posts:", result);
        setPosts([]);
      }
    } catch (error) {
      setMessage("Error fetching posts.");
      console.error("Fetch Posts Error:", error);
      setPosts([]);
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
      if (Array.isArray(result)) {
        setCategories(result);
      } else {
        console.error("Unexpected response for categories:", result);
        setCategories([]);
      }
    } catch (error) {
      setMessage("Error fetching categories.");
      console.error("Fetch Categories Error:", error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
    fetchCategories();
  }, []);

  const createPost = async (data) => {
    console.log(data);
    const { field1: title, field2: content, category } = data;
    try {
      // if (!category) {
      //   setMessage("Please select a category.");
      //   return;
      // }

      const response = await fetch("/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
          category_id: category.length > 0 ? category : null,
        }),
      });

      const newPost = await response.json();
      if (!newPost.id) {
        setMessage("Error creating post.");
        return;
      }

      const updatedPost = {
        ...newPost,
        user: { username: user.username },
      };
      setPosts([updatedPost, ...posts]);
    } catch (error) {
      setMessage("Error creating post.");
      console.error("Create Post Error:", error);
    }
  };

  const createCategory = async (data) => {
    const { field1: name, field2: description } = data;
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
      console.error("Create Category Error:", error);
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
              onClick={() =>
                navigate(`/category/${category.id}`, {
                  state: { category: category, username: user.username },
                })
              }
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
                  state: { username: user.username },
                })
              }
            >
              <p style={mainstyle.postContent}>{post.user.username}</p>
              <h3 style={mainstyle.postTitle}>{post.title}</h3>
              <p style={mainstyle.postContent}>{post.content}</p>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => {
          setModalType("post");
          setIsModalOpen(true);
        }}
        style={{
          position: "fixed",
          bottom: "90px",
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
          setModalType("category");
          setIsModalOpen(true);
        }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#1563B8",
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
          type={modalType}
          onClose={() => setIsModalOpen(false)}
          onSubmit={modalType === "post" ? createPost : createCategory}
          categories={categories}
        />
      )}
    </div>
  );
}

export default MainPage;
