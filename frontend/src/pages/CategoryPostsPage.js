import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mainstyle } from "../styles/MainStyle";

function CategoryPostsPage() {
  const { category_id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      try {
        const response = await fetch(`/categories/${category_id}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const result = await response.json();

        setPosts(result.posts || []);
        setCategory(result.category || {});
      } catch (error) {
        console.error("Error fetching posts by category:", error);
      }
    };

    fetchPostsByCategory();
  }, [category_id]);

  return (
    <div style={mainstyle.mainContainer}>
      <header style={mainstyle.header}>
        <div style={mainstyle.headerContent}>
          <span>
            {category.name ? `Posts in ${category.name}` : "Category Posts"}
          </span>
          <button style={mainstyle.closeButton} onClick={() => navigate(-1)}>
            ✕
          </button>
        </div>
      </header>

      {category.description && (
        <section style={mainstyle.categoryDescription}>
          <p>{category.description}</p>
        </section>
      )}

      <div style={mainstyle.postsContainer}>
        {posts.length === 0 ? (
          <p>No posts available for this category.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              style={mainstyle.postBox}
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <h3 style={mainstyle.postTitle}>{post.title}</h3>
              <p style={mainstyle.postContent}>{post.content}</p>
              <p style={mainstyle.postAuthor}>By: {post.user.username}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryPostsPage;
