import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PostContext } from "../Context/PostContext.js";
import axios from 'axios';
import { get_use_id } from "../Server/storage.js";

export default function DeletePost() {
  const { postId } = useParams(); 
  const { baseUrl } = useContext(PostContext);
  const [post, setPost] = useState({});
  const [deletePost, setDeletePost] = useState("");
  const [errors, setErrors] = useState({ require: false, message: "" });
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

  // Clean function to normalize both titles
  const clean = (str) =>
    str
      ?.trim()
      ?.normalize("NFKD")
      ?.replace(/\s+/g, " ") 
      ?.replace(/[\u200B-\u200D\uFEFF]/g, "") 
      ?.toLowerCase();

  
  const handleChange = (e) => {
    setDeletePost(e.target.value);
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deletePost) {
      setErrors({ require: true, message: "Please enter the title." });
      return;
    }

    
    if (clean(deletePost) === clean(post.title)) {
      try {
        await axios.delete(`${baseUrl}/post/user/deletepost/${localId}/${postId}`);
        navigate(`/profile/mypost/${localId}`);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      setErrors({ require: true, message: "Entered title does not match!" });
    }
  };

  return (
    <div className='delete-parent flex items-center justify-center min-h-screen'>
      <div className='delete-child bg-white shadow-lg rounded-2xl p-8 w-96'>
        <h1 className='delete-title text-2xl font-bold text-center text-red-600 mb-4'>
          Delete Post
        </h1>

        <form onSubmit={handleSubmit}>
          <p className='text-center mb-2'>
            Enter your post title to confirm deletion:
          </p>
          <p className='text-center mb-4'>
            Title: <span className='font-bold text-red-500'>{post.title}</span>
          </p>

          <input
            type="text"
            placeholder="Enter the title"
            value={deletePost}
            onChange={handleChange}
            className='outline-none pl-3 border-2 border-red-700 rounded-lg placeholder-gray-500 w-full my-3 h-10'
          />

          {errors.require && (
            <p className='text-red-500 text-center mb-3'>{errors.message}</p>
          )}

          <div className='flex items-center justify-center'>
            <button
              type="submit"
              className='delete-btn bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300'
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
