import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostContext } from "../Context/PostContext.js";
import axios from "axios";

export default function Followers() {
  const { id } = useParams(); // local user's ID
  const navigate = useNavigate();
  const { baseUrl } = useContext(PostContext);
  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [followStatus, setFollowStatus] = useState({}); // track per follower

  // Fetch local user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/user/${id}`);
        setUser(res.data.user);
      } catch (err) {
        console.log("Error fetching user:", err.message);
      }
    };
    fetchUser();
  }, [id, baseUrl]);

  // Fetch followers of the local user
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/user/${id}/followers`);
        const allFollowers = res.data.allFollowers || [];
        setFollowers(allFollowers);

        // build map for follow status (if local user follows them back)
        const status = {};
        allFollowers.forEach((f) => {
          status[f._id] = f.followers?.includes(id) || false;
        });
        setFollowStatus(status);
      } catch (err) {
        console.log("Error fetching followers:", err.message);
      }
    };
    fetchFollowers();
  }, [id, baseUrl]);

  // Handle follow/unfollow back
  const handleFollow = async (followerId) => {
    try {
      const currentlyFollowing = followStatus[followerId];

      if (currentlyFollowing) {
        await axios.patch(`${baseUrl}/post/user/unfollow/${followerId}/${id}`);
      } else {
        await axios.patch(`${baseUrl}/post/user/followers/${followerId}/${id}`);
      }

      // Update instantly in UI
      setFollowStatus((prev) => ({
        ...prev,
        [followerId]: !currentlyFollowing,
      }));
    } catch (err) {
      console.log("Error in follow/unfollow:", err.message);
    }
  };

  return (
    <div className="home-parent w-full min-h-screen flex flex-col items-center pt-10">
      {/* Tab Buttons */}
      <div className="flex mb-6">
        <button className="bg-blue-900 text-blue-300 px-6 py-2 rounded-l-xl font-semibold shadow-md">
          Followers
        </button>
        <button
          onClick={() => navigate(`/user/${id}/following`)}
          className="bg-blue-300 text-blue-900 px-6 py-2 rounded-r-xl font-semibold hover:bg-blue-400 transition"
        >
          Following
        </button>
      </div>

      {/* Followers List */}
      <div className="flex flex-col items-center gap-6 w-full">
        {followers.length > 0 ? (
          followers.map((follower) => (
            <div
              key={follower._id}
              className="follow-main w-80 bg-blue-100 border-2 border-blue-400 rounded-2xl shadow-md p-4"
            >
              <div className="flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold font-mono text-gray-800 mb-2">
                  Name:{" "}
                  <span className="text-blue-700 font-semibold">
                    {follower.userName}
                  </span>
                </h2>
                <p className="text-lg md:text-xl font-semibold font-mono text-gray-700">
                  User ID:{" "}
                  <span className="text-blue-800">{follower.userId}</span>
                </p>

                <button
                  onClick={() => handleFollow(follower._id)}
                  className="mt-3 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition"
                >
                  {followStatus[follower._id] ? "Unfollow" : "Back Follow"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-lg font-semibold">
            No followers yet 😢
          </p>
        )}
      </div>
    </div>
  );
}
