import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostContext } from "../Context/PostContext.js";
import axios from 'axios';
import { get_use_id } from '../Server/storage.js';

export default function EditPost() {
  const { postId } = useParams();
  const { baseUrl } = useContext(PostContext);
  const [post, setPost] = useState({});
  const [errors, setErrors] = useState({
    title: { required: false, message: "" },
    content: { required: false, message: "" },
  });
  const localUser = get_use_id();
const localId = localUser?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const FindOnePost = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/${postId}`);
        setPost(res.data.post);
      } catch (err) {
        console.log(err.message);
      }
    };
    if (postId) FindOnePost();
  }, [baseUrl, postId]);


  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    let valid = true;
    const newErrors = { title: {}, content: {} };

    //  validation
    if (!post.title || post.title.trim() === "") {
      newErrors.title = { required: true, message: "Title is required!" };
      valid = false;
    } else {
      newErrors.title = { required: false, message: "" };
    }
    if (!post.content || post.content.trim() === "") {
      newErrors.content = { required: true, message: "Content is required!" };
      valid = false;
    } else {
      newErrors.content = { required: false, message: "" };
    }

    setErrors(newErrors);
    if (valid) {
     try {
       await axios.patch(`${baseUrl}/post/user/editpost/${localId}/${postId}`, post);
        navigate(`/profile/mypost/${localId}`);
        } catch (err) {
        console.log("Axios error:", err.response?.data || err.message);
        }
    }
  };

  return (
    <div className="delete-parent flex items-center justify-center min-h-screen">
      <div className="edit-child bg-white shadow-lg rounded-2xl p-8 w-96">
        <form
          className="flex flex-col gap-5 p-3 items-center justify-center w-full"
          onSubmit={handleSubmit}
        >
          <h1 className="edit-title text-2xl font-bold text-center mb-4">
            Edit Post
          </h1>

          <input
            className="edit-inputs h-10 border-2 border-blue-600 rounded-lg px-3 w-full outline-none"
            type="text"
            placeholder="Title"
            name="title"
            value={post.title || ""}
            onChange={handleChange}
          />
          {errors.title.required && (
            <p className="text-red-500 text-sm text-center">
              {errors.title.message}
            </p>
          )}

      
          <textarea
            className="edit-inputs h-32 border-2 border-blue-600 rounded-lg px-3 py-2 w-full outline-none"
            placeholder="Content"
            name="content"
            value={post.content || ""}
            onChange={handleChange}
          ></textarea>
          {errors.content.required && (
            <p className="text-red-500 text-sm text-center">
              {errors.content.message}
            </p>
          )}

          
          <button
            type="submit"
            className="edit-btn bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
