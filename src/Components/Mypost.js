import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { PostContext } from "../Context/PostContext.js";

export default function Mypost() {
  const { id } = useParams();
  const { baseUrl } = useContext(PostContext);
  const [user, setUser] = useState(null);
  const [userPost, setUserPost] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const FindUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/user/${id}`);
        setUser(res.data.user);
        setUserPost(res.data.user.posts || []);
      } catch (err) {
        console.log(err.message);
      }
    };
    FindUser();
  }, [id, baseUrl]);

  return (
    <div className="flex justify-center flex-col items-center mx-auto w-full md:w-3/4 md:fixed md:right-0 overflow-y-auto pt-20 pb-24">
      {user ? (
       <div className="flex flex-col items-center justify-center gap-6 w-full">
          <h1 className="text-xl font-bold mb-4">{user.userName}'s Posts</h1>
          {userPost.length > 0 ? (
            userPost.map((post) => (
              <div key={post._id} className="post-card">
                  <h2 className="font-semibold post-title">{post.title}</h2>
                  <p className="post-home">{post.content}</p>
                  <div className="flex flex-row gap-5 p-5">
                    <button className="profile-btn"  onClick={()=>navigate(`/profile/mypost/editpost/${post._id}`)}>Edit</button>
                    <button className="profile-btn" onClick={()=>navigate(`/profile/mypost/deletepost/${post._id}`)}>delete</button>
                  </div>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
