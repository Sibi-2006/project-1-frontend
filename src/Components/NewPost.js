import axios from 'axios';
import React, { useState , useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PostContext } from "../Context/PostContext.js"

export default function NewPost() {
  const { id } = useParams();
  const data = JSON.parse(localStorage.getItem("aurth"));
  const { baseUrl } = useContext(PostContext)
  
  
  const [post, setPost] = useState({
    title: "",
    content: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const verified_inputs = () => {
    let valid = true;
    let newErrors = { title: "", content: "" };

    if (!post.title.trim()) {
      newErrors.title = "Please enter a title...";
      valid = false;
    }

    if (!post.content.trim()) {
      newErrors.content = "Please enter content...";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valid = verified_inputs();
    if (!valid) return;

    try {
      const res = await axios.patch(`${baseUrl}/post/user/${id}`, {
        title: post.title,
        content: post.content
      });


      if (res.status === 200) {
        setMessage("✅ Post added successfully!");
        setPost({ title: "", content: "" }); 
      } else {
        setMessage("⚠️ Something went wrong...");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("❌ Failed to add post. Try again.");
    }
  };

  return (
    <div className="parent">
      {data ? (
        <form className="child" onSubmit={handleSubmit}>
          <h1 className="title-form">Add New Post</h1>

          <input
            type="text"
            placeholder="Title of the post"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="inputs"
          />
          {errors.title && <p className="error-message">{errors.title}</p>}

          <textarea
            name="content"
            placeholder="Content of the post"
            value={post.content}
            onChange={handleChange}
            className="post-contant"
          ></textarea>
          {errors.content && <p className="error-message">{errors.content}</p>}

          {message && <p className="status-message">{message}</p>}

          <button type="submit" className="form-btn">
            Add post...
          </button>
        </form>
      ) : (
        <div className="child">
          <h1>To Post, Sign-In or Sign-Up</h1>
          <p>
            <Link to="/signin" className="form-btn">
              Sign-In
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
