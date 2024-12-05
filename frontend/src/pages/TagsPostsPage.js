import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { mainstyle } from "../styles/MainStyle";

function TagsPostsPage() {
  const { tag_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPostsByCategory = async () => {
      try {
        const response = await fetch(`/posts/tags/${tag_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const result = await response.json();

        setPosts(result || []);
      } catch (error) {
        console.error("Error fetching posts by category:", error);
      }
    };

    fetchPostsByCategory();
  }, [tag_id, location.state.category]);

  return (
    <div style={mainstyle.mainContainer}>
      <header style={mainstyle.header}>
        <div style={mainstyle.headerContent}>
          <span>
            {location.state.category.name
              ? `Posts in ${location.state.category.name}`
              : "Category Posts"}
          </span>
          <button style={mainstyle.closeButton} onClick={() => navigate(-1)}>
            ✕
          </button>
        </div>
      </header>

      {location.state.category.description && (
        <section style={mainstyle.categoryDescription}>
          <p>{location.state.category.description}</p>
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
              onClick={() =>
                navigate(`/post/${post.id}`, {
                  state: { username: location.state.username },
                })
              }
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

export default TagsPostsPage;
