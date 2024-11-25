import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mainstyle } from "../styles/MainStyle";

export function PostDetailPage() {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/posts/${post_id}`);
        const result = await response.json();

        if (result) {
          setPost(result);
        } else {
          setMessage('Post not found.');
        }
      } catch (error) {
        setMessage('Error fetching post details.');
        console.error(error);
      }
    };

    if (post_id) {
      fetchPost();
    } else {
      setMessage('Post ID is missing.');
    }
  }, [post_id]);

  if (!post) {
    return <p>{message || "Loading..."}</p>;
  }

  return (
    <div style={mainstyle.mainContainer}>  
      <header style={mainstyle.header}> 
        <button 
          onClick={() => navigate(-1)} 
          style={mainstyle.backButton}
        >
          Back to Main
        </button>
      </header>
      <div style={mainstyle.postDetailContainer}> 
        <h2 style={mainstyle.postTitle}>{post.title}</h2>
        <p><strong>Posted by User {post.user_id}</strong></p>
        <p>{post.content}</p>
        <p><em>Created on: {new Date(post.created_at).toLocaleString()}</em></p>
        {post.updated_at && <p><em>Last updated on: {new Date(post.updated_at).toLocaleString()}</em></p>}
      </div>
    </div>
  );
}

export default PostDetailPage;
