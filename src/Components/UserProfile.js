import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get_use_id } from "../Server/storage.js";
import { PostContext } from "../Context/PostContext.js";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { baseUrl } = useContext(PostContext);
  const Currentuser = get_use_id();
  const currentUserId = Currentuser?.id;
  
  useEffect(() => {
    const FindUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/user/${id}`);
        setUser(res.data.user);
      } catch (err) {
        console.log(err.message);
      }
    };
    FindUser();
  }, [id, baseUrl]);

  if (!user) {
    return (
      <div className="parent">
        <div className="child">
          <h2>Loading user data...</h2>
        </div>
      </div>
    );
  }

  const isFollowing = user?.followers?.includes(currentUserId);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.patch(`${baseUrl}/post/user/unfollow/${id}/${currentUserId}`);
      } else {
        await axios.patch(`${baseUrl}/post/user/followers/${id}/${currentUserId}`);
      }

      // Refresh user data
      const updatedUser = await axios.get(`${baseUrl}/post/user/${id}`);
      setUser(updatedUser.data.user);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="parent">
      <div className="profile">
        <div className="flex flex-col md:flex-row gap-3">
          <h2>User Id: <span className="font-bold text-pink-400">{user.userId}</span></h2>
          <h1>User Name: <span className="font-bold text-pink-400">{user.userName}</span></h1>
        </div>

        <div className="flex flex-row gap-3">
          <div className="flex flex-col items-center">
            <h4 className="text-pink-400">{user.followers?.length || 0}</h4>
            <h4>followers</h4>
          </div>
          <div className="flex flex-col items-center">
            <h4 className="text-pink-400">{user.following?.length || 0}</h4>
            <h4>following</h4>
          </div>
        </div>

        <p><span className="text-pink-500 font-bold">{user.bio}</span></p>

        <div className="flex flex-row gap-5">
          <button className="profile-btn" onClick={handleFollowToggle}>
            {isFollowing ? "Unfollow ❌" : "Follow 💖"}
          </button>

          <button className="profile-btn" onClick={() => navigate(`/command/${id}/oneuser`)}>
            {user.userName} has <span className="text-pink-400 font-bold">{user.posts.length}</span> posts
          </button>
        </div>
      </div>
    </div>
  );
}
