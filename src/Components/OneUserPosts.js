import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { PostContext } from "../Context/PostContext.js";
import like from "../assets/cat_like.jpg";
import command from "../assets/cat_command.jpg";
import { get_use_id } from "../Server/storage.js";

export default function OneUserPosts() {
  const { id } = useParams();
  const { baseUrl } = useContext(PostContext);
  const [user, setUser] = useState(null);
  const [userPost, setUserPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const localUser = get_use_id();
  const local_id = localUser?.id;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseUrl}/post/user/${id}`);
        setUser(res.data.user);
        setUserPost(res.data.user?.posts || []);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, baseUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading user data...</p>
      </div>
    );
  }
  
 let lastTap = 0;

function handleDoubleTap(post) {
  const now = Date.now();
  const timeSince = now - lastTap;

  if (timeSince < 300 && timeSince > 0) {
    handleLikes(post);
  }

  lastTap = now;
}

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">User not found.</p>
      </div>
    );
  }
  const handleLikes =async (post)=>{
    const postId=post?._id;
    const userId = user?._id;
    post.likes = Array.isArray(post.likes) ? post.likes : [];
    const isLiked = post.likes.includes(local_id);
    try {
      if (isLiked) {
        await axios.patch(`${baseUrl}/post/user/unlike/${userId}/${local_id}/${postId}`);
        post.likes = post.likes.filter(id => id !== local_id);
      } else {
        await axios.patch(`${baseUrl}/post/user/like/${userId}/${local_id}/${postId}`);
        post.likes.push(local_id);
      }

      
      setUserPost(prev => prev.map(p => (p.postId === postId ? { ...post } : p)));

    } catch (err) {
      console.error(err.response?.data || err.message);
    }

    
  }
  return (
    <div className="flex justify-center flex-col items-center mx-auto w-full md:w-3/4 overflow-y-auto pt-20 pb-24 "    >
      <h1 className="text-2xl font-bold mb-6">{user.userName}'s Posts</h1>

      {userPost.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-6 w-full"
        
        >
          {userPost.map((post) => (
            <div key={post._id} className="post-card"
            onClick={()=>handleDoubleTap(post)}
            >
              <h2 className="font-semibold post-title">{post.title || "Untitled"}</h2>
              <p className="post-home mt-2">
            {post.content
              ? post.content.length > 75
                ? post.content.slice(0, 75) + "..."
                : post.content
              : "No content"}
          </p>

              <div className="flex flex-row gap-4 mt-4">
                <button
                  className={`flex items-center gap-2 rounded-xl transition-colors duration-200 pr-4
                    ${post.likes?.includes(local_id) 
                      ? "bg-pink-500 hover:bg-pink-600 text-white" 
                      : "bg-blue-400 hover:bg-blue-500 text-black"}`}
                  onClick={() => handleLikes(post)}
                >
                  <img className="h-10 w-10 rounded-l-xl" src={like} alt="like" />
                  <span className="font-bold">{post.likes?.length || 0}</span> -Like
                </button>


                <button className="flex items-center gap-2  rounded-xl bg-blue-400 hover:bg-blue-500 transition-colors duration-200 pr-4"  onClick={() => navigate(`/command/${post._id}`)}>
                  <img className="h-10 w-10 rounded-l-xl" src={command} alt="command" />
                  <span className="font-bold ">{post.reply?.length || 0}</span> -Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mt-4">No posts yet.</p>
      )}
    </div>
  );
}
