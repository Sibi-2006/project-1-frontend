import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostContext } from "../Context/PostContext.js";
import axios from "axios";

export default function Following() {
  const { id } = useParams(); // local user's ID
  const navigate = useNavigate();
  const { baseUrl } = useContext(PostContext);

  const [user, setUser] = useState({});
  const [following, setFollowing] = useState([]);
  const [followStatus, setFollowStatus] = useState({}); // track per following

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

  // Fetch following list of the local user
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/user/${id}/following`);
        const allfollowings = res.data.allfollowings || [];
        setFollowing(allfollowings);

        // build map for follow status (if still following)
        const status = {};
        allfollowings.forEach((f) => {
          status[f._id] = true;
        });
        setFollowStatus(status);
      } catch (err) {
        console.log("Error fetching following:", err.message);
      }
    };
    fetchFollowing();
  }, [id, baseUrl]);

  // Handle follow/unfollow
  const handleFollow = async (targetId) => {
    try {
      const currentlyFollowing = followStatus[targetId];

      if (currentlyFollowing) {
        // unfollow
        await axios.patch(`${baseUrl}/post/user/unfollow/${targetId}/${id}`);
      } else {
        // follow again
        await axios.patch(`${baseUrl}/post/user/followers/${targetId}/${id}`);
      }

      // Update instantly in UI
      setFollowStatus((prev) => ({
        ...prev,
        [targetId]: !currentlyFollowing,
      }));
    } catch (err) {
      console.log("Error in follow/unfollow:", err.message);
    }
  };

  return (
    <div className="home-parent w-full min-h-screen flex flex-col items-center pt-10">
      {/* Tab Buttons */}
      <div className="flex mb-6">
        <button
          onClick={() => navigate(`/user/${id}/followers`)}
          className="bg-blue-300 text-blue-900 px-6 py-2 rounded-l-xl font-semibold hover:bg-blue-400 transition"
        >
          Followers
        </button>
        <button className="bg-blue-900 text-blue-300 px-6 py-2 rounded-r-xl font-semibold shadow-md">
          Following
        </button>
      </div>

      {/* Following List */}
      <div className="flex flex-col items-center gap-6 w-full">
        {following.length > 0 ? (
          following.map((followed) => (
            <div
              key={followed._id}
              className="follow-main w-80 bg-blue-100 border-2 border-blue-400 rounded-2xl shadow-md p-4"
            >
              <div className="flex flex-col">
                <h2 className="text-xl md:text-2xl font-bold font-mono text-gray-800 mb-2">
                  Name:{" "}
                  <span className="text-blue-700 font-semibold">
                    {followed.userName}
                  </span>
                </h2>
                <p className="text-lg md:text-xl font-semibold font-mono text-gray-700">
                  User ID:{" "}
                  <span className="text-blue-800">{followed.userId}</span>
                </p>

                <button
                  onClick={() => handleFollow(followed._id)}
                  className={`mt-3 px-4 py-1 rounded-lg font-semibold transition ${
                    followStatus[followed._id]
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {followStatus[followed._id] ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-lg font-semibold">
            You’re not following anyone yet 😢
          </p>
        )}
      </div>
    </div>
  );
}
