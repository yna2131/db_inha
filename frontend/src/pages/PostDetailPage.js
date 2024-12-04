import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import main from "../assets/Main.svg";
import { postStyle } from "../styles/PostStyle";

export function PostDetailPage() {
  const { post_id } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    if (post_id) {
      fetchPost();
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
    </div>
  );
}

export default PostDetailPage;
