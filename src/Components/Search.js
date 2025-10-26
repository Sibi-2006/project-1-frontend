import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { PostContext } from "../Context/PostContext.js";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const { baseUrl } = useContext(PostContext);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${baseUrl}/form`);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [baseUrl]);

  const filteredUsers = users.filter((u) =>
    u.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-parent">
      <div className="search-btn">
        <input
          className="search-bar"
          type="search"
          placeholder="Search users..."
          value={search}
          onChange={handleChange}
        />
      </div>

      <div className=" w-full flex justify-center flex-col items-center">
        {loading && <p>Loading users...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && filteredUsers.length === 0 && (
          <p>No users found.</p>
        )}

        {!loading && !error &&
          filteredUsers.map((u) => (
            <div key={u._id} className="search-main">
              <div className=" flex flex-col">
                  <h2 className="text-xl md:text-2xl font-bold font-mono text-black"> Name : <samp className="post-title">{u.userName}</samp></h2>
                  <p className="text-xl md:text-2xl font-bold font-mono text-black">User ID: <samp className=" text-blue-800 ">{u.userId}</samp></p>
                  
              </div>
              <button className="btn"
                onClick={()=>navigate(`/command/userprofile/${u._id}`)}
              >View Profile</button>
            </div>
          ))}
      </div>
    </div>
  );
}
