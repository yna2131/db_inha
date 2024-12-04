import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { postStyle } from "../styles/PostStyle";
import main from "../assets/Main.svg";

export function PostDetailPage() {
  const { post_id } = useParams();
  const location = useLocation();
  const user_id = location.state?.userId;
  const pseudo = location.state?.pseudo;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [message, setMessage] = useState("");
  const [usernames, setUsernames] = useState({});
  const navigate = useNavigate();

  const fetchUsername = async (userId) => {
    try {
      const response = await fetch(`/users/${userId}`);
      const user = await response.json();
      if (user && user.pseudo) {
        setUsernames((prev) => ({ ...prev, [userId]: user.pseudo }));
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/posts/${post_id}`);
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

    const fetchComments = async () => {
      try {
        const response = await fetch(`/comments/post/${post_id}`);
        const result = await response.json();

        if (result && Array.isArray(result)) {
          const sortedComments = result.sort(
            (a, b) =>
              new Date(b.comment_created_at) - new Date(a.comment_created_at)
          );
          setComments(sortedComments);
          const uniqueUserIds = [
            ...new Set(result.map((comment) => comment.user_id)),
          ];
          uniqueUserIds.forEach(fetchUsername);
        } else {
          setMessage("No comments found for this post.");
        }
      } catch (error) {
        setMessage("Error fetching comments.");
        console.error(error);
      }
    };

    if (post_id) {
      fetchPost();
      fetchComments();
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          post_id: parseInt(post_id),
          user_id: user_id,
        }),
      });

      if (response.ok) {
        const createdComment = await response.json();

        setComments(
          [createdComment, ...comments].sort(
            (a, b) =>
              new Date(b.comment_created_at) - new Date(a.comment_created_at)
          )
        );

        if (user_id) {
          fetchUsername(user_id);
        }

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
          <img
            src={main}
            alt="User Avatar"
            style={postStyle.avatar}
          />
          <span style={postStyle.username}>{pseudo || "User"}</span>
        </div>
        <button style={postStyle.closeButton} onClick={() => navigate(-1)}>
          ✕
        </button>
      </header>

      <main style={postStyle.postContent}>
        <h2 style={postStyle.postTitle}>{post.title}</h2>
        <p>
          <strong>Posted by User {post.user_id}</strong>
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
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.comment_id} style={postStyle.comment}>
              <div style={postStyle.commentHeader}>
                <strong style={postStyle.commentUser}>
                  {usernames[comment.user_id] || "User"}
                </strong>
              </div>
              <p style={postStyle.commentText}>{comment.content}</p>
              <p>
                <em>
                  Posted on:{" "}
                  {new Date(comment.comment_created_at).toLocaleString()}
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
