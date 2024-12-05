import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import main from "../assets/Main.svg";
import EditPostModal from "../components/EditPostModal";
import { postStyle } from "../styles/PostStyle";

export function PostDetailPage() {
  const { post_id } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchPost = async () => {
    try {
      const response = await fetch(`/posts/${post_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const result = await response.json();

      if (result) {
        setPost(result);
      } else {
        setMessage("Post not found.");
      }
    } catch (error) {
      setMessage("Error fetching post details.");
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      const result = await response.json();

      if (Array.isArray(result)) {
        setCategories(result);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (post_id) {
      fetchPost();
      fetchCategories();
    } else {
      setMessage("Post ID is missing.");
    }
  }, [post_id]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      alert("Comment content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          content: newComment,
          post_id: parseInt(post_id),
        }),
      });

      if (response.ok) {
        const createdComment = await response.json();
        const updatedComments = [
          ...post.comments,
          {
            ...createdComment,
            user: {
              username: location.state.username,
            },
          },
        ];

        setPost({
          ...post,
          comments: updatedComments,
        });
        setNewComment("");
      } else {
        const error = await response.json();
        alert(`Failed to add comment: ${error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error adding comment.");
    }
  };

  const handleEditPost = async (updatedData) => {
    try {
      const response = await fetch(`/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPost(updatedPost);
        setIsEditModalOpen(false);
      } else {
        alert("Error updating the post.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`/posts/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.ok) {
        navigate("/main");
      } else {
        alert("Error deleting post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post.");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (!post) {
    return <p>{message || "Loading..."}</p>;
  }

  return (
    <div>
      <header style={postStyle.header}>
        <div style={postStyle.userInfo}>
          <img src={main} alt="User Avatar" style={postStyle.avatar} />
          <span style={postStyle.username}>
            {location.state.username || "User"}
          </span>
        </div>
        <button style={postStyle.closeButton} onClick={() => navigate(-1)}>
          ✕
        </button>
      </header>

      {post.user.username === location.state.username ? (
        <>
          <button
            onClick={() => setIsEditModalOpen(true)}
            style={{
              ...postStyle.addCommentButton,
              position: "absolute",
              top: "105px",
              right: "150px",
            }}
          >
            Edit Post
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            style={{
              ...postStyle.addCommentButton,
              position: "absolute",
              top: "105px",
              right: "10px",
              backgroundColor: "#D9534F",
              marginRight: "20px",
            }}
          >
            Delete Post
          </button>
        </>
      ) : null}

      <main style={postStyle.postContent}>
        <h2 style={postStyle.postTitle}>{post.title}</h2>
        <p>
          <strong>Posted by {post.user.username}</strong>
        </p>
        <p>{post.content}</p>
        <p>
          <em>Created on: {new Date(post.created_at).toLocaleString()}</em>
        </p>
        {post.updated_at && (
          <p>
            <em>
              Last updated on: {new Date(post.updated_at).toLocaleString()}
            </em>
          </p>
        )}
        <div
          style={{
            backgroundColor: "#1563B8",
            color: "white",
            padding: "5px 10px",
            borderRadius: "20px",
            display: "inline-block",
            marginBottom: "2px",
            fontSize: "14px",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>
              Category: {post.category ? post.category.name : "None"}
            </strong>
          </p>
        </div>
      </main>

      <section style={postStyle.commentsSection}>
        <h3>Write a Comment</h3>
        <textarea
          style={postStyle.commentPlaceholder}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
        />
        <button onClick={handleAddComment} style={postStyle.addCommentButton}>
          Post Comment
        </button>

        <h3>Comments</h3>
        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div key={`comments-${comment.id}`} style={postStyle.comment}>
              <div style={postStyle.commentHeader}>
                <strong style={postStyle.commentUser}>
                  {comment.user.username || "User"}
                </strong>
              </div>
              <p style={postStyle.commentText}>{comment.content}</p>
              <p>
                <em>
                  Posted on: {new Date(comment.created_at).toLocaleString()}
                </em>
              </p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </section>

      {isEditModalOpen && (
        <EditPostModal
          post={post}
          categories={categories}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditPost}
        />
      )}

      {isDeleteModalOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              style={styles.closeButton}
            >
              ✕
            </button>
            <h2>Are you sure you want to delete this post?</h2>
            <div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button onClick={handleDeletePost} style={styles.confirmButton}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    minWidth: "300px",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  confirmButton: {
    backgroundColor: "#D9534F",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default PostDetailPage;
