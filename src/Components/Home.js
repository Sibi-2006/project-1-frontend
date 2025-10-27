import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import like from "../assets/cat_like.jpg";
import command from "../assets/cat_command.jpg";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../Context/PostContext.js";
import { get_use_id } from "../Server/storage.js";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [likedPostId, setLikedPostId] = useState(null);
  const navigate = useNavigate();
  const { baseUrl } = useContext(PostContext);
  const localUser = get_use_id();
  const local_id = localUser ? localUser.id : null;

  // Fetch posts when page changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${baseUrl}/post/all?page=${page}&limit=5`);
        if (!res.data.posts) return;

        const mappedPosts = res.data.posts.map((p) => ({
          postId: p.postId || p._id,
          title: p.title,
          content: p.content,
          userName: p.userName,
          userId: p.userId,
          likes: Array.isArray(p.likes) ? p.likes : [],
          reply: Array.isArray(p.reply) ? p.reply : [],
        }));

        // Avoid duplicates
        setPosts((prev) => [
          ...prev,
          ...mappedPosts.filter(
            (newPost) =>
              !prev.some(
                (old) =>
                  old.postId === newPost.postId && old.userId === newPost.userId
              )
          ),
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, baseUrl]);

  // Infinite scroll
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 100
          ) {
            setPage((prev) => prev + 1);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  let lastTap = 0;

  function handleDoubleTap(post) {
    const now = Date.now();
    const timeSince = now - lastTap;

    if (timeSince < 300 && timeSince > 0) {
      handleLikes(post);
      setLikedPostId(post.postId);
      setTimeout(() => setLikedPostId(null), 700);
    }

    lastTap = now;
  }

  // Handle like/unlike
  const handleLikes = async (post) => {
    const postId = post.postId;
    const userId = post.userId;
    post.likes = Array.isArray(post.likes) ? post.likes : [];
    const isLiked = post.likes.includes(local_id);
    
    try {
      if (isLiked) {
        await axios.patch(
          `${baseUrl}/post/user/unlike/${userId}/${local_id}/${postId}`
        );

        post.likes = post.likes.filter((id) => id !== local_id);
        
      } else {
        await axios.patch(
          `${baseUrl}/post/user/like/${userId}/${local_id}/${postId}`
        );
        post.likes.push(local_id);
        setLikedPostId(post.postId);
        setTimeout(() => setLikedPostId(null), 700);
      }

      setPosts((prev) =>
        prev.map((p) => (p.postId === postId ? { ...post } : p))
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

const randomHeart = () => {
  const hearts = ["💙","❤","💚","💖","💗","💛","💜","💝","🤍","🤎","💓","🖤","❤️‍🩹","💕","💞","💌","💟"];
  const index = Math.floor(Math.random() * hearts.length);
  return hearts[index];
};

  return (
    <div className="flex justify-center flex-col items-center mx-auto w-full md:w-3/4 overflow-y-auto pt-20 pb-24">
      {posts.map((post, index) => (
        <div
          key={post.userId && post.postId ? `${post.userId}-${post.postId}` : index}
          className="relative post-card mb-6 p-4 border rounded-lg shadow-md select-none"
          onClick={() => handleDoubleTap(post)}
        >
          {/* ❤️ Pop animation */}
          {likedPostId === post.postId && (
            <div className="absolute inset-0 flex items-center justify-center animate-pop-heart pointer-events-none">
              <span className="text-6xl">{randomHeart()}</span>
            </div>
          )}

          <h2 className="post-title text-xl font-bold">{post.title || "Untitled"}</h2>
          <p className="post-home mt-2">
            {post.content
              ? post.content.length > 75
                ? post.content.slice(0, 75) + "..."
                : post.content
              : "No content"}
          </p>

          <p className="text-sm text-gray-500">-by {post.userName || "Unknown"}</p>

          <div className="flex flex-row gap-5 mt-5">
            <button
              className={`flex flex-row justify-around items-center rounded-xl transition-all duration-300
                ${post.likes.includes(local_id)
                  ? "bg-pink-400 scale-105"
                  : "bg-blue-400"} 
                hover:bg-white`}
              onClick={() => handleLikes(post)}
            >
              <img className="h-10 w-10 rounded-l-xl" src={like} alt="like" />
              <p className="px-2">
                <samp className="font-bold">{post.likes.length}</samp> -Like
              </p>
            </button>

            <button
              onClick={() => navigate(`/command/${post.postId}`)}
              className="flex flex-row justify-around items-center bg-blue-400 rounded-xl hover:bg-white"
            >
              <img className="h-10 w-10 rounded-l-xl" src={command} alt="command" />
              <p className="px-2">
                Read more...
              </p>
            </button>
          </div>
        </div>
      ))}

      {loading && <p className="text-center my-4">Loading more posts...</p>}
    </div>
  );
}
