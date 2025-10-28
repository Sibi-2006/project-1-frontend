import axios from 'axios';
import React, { useEffect, useState ,useContext } from 'react';
import { Link, useParams , useNavigate } from 'react-router-dom';
import { getAurth } from '../Server/storage.js';
import { PostContext } from "../Context/PostContext.js"

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { baseUrl } = useContext(PostContext)
  
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
  }, [id,baseUrl]);

  if ( !getAurth()) {
    return (
      <div className="parent">
        <div className="child">
          <h1>To see profile, Sign-In or Sign-Up</h1>
          <p>
            <Link to={'/signin'} className="form-btn">Sign-In</Link>
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="parent">
        <div className="child">
          <h2>Loading user data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="parent ">
      <div className="profile">
          <div className=' flex flex-col md:flex-row gap-3 ' >
              <h2>User Id : <samp className=' font-bold text-pink-400'>{user?.userId}</samp></h2>
              <h1>User Name :<samp className=' font-bold text-pink-400'>{user?.userName}</samp> </h1>
            </div>
        <div>
            <div className=' flex flex-row gap-3 '>

              <div className=' flex flex-col justify-center items-center cursor-pointer'
                onClick={()=>navigate(`/user/${id}/followers`)}
              >
                <h4 className=' text-pink-400'>{user?.followers.length}</h4>
                <h4>followers</h4>
              </div>

              <div className=' flex flex-col justify-center items-center cursor-pointer'
              onClick={()=>navigate(`/user/${id}/following`)}
              >
                <h4 className=' text-pink-400'>{user?.following.length}</h4>
                <h4>following</h4>
              </div>
            </div>
        </div>

        <div className='w-3/4 md:w-5/6 text-center'>
          <p >  <span className="text-pink-500 font-bold italic tracking-wide">{user?.bio}</span>
</p>
        </div>
        
        <div className=' flex flex-row gap-5'>
          <button 
            className='profile-btn' 
            onClick={() => navigate(`/profile/edit/${id}`)}
          >
            Edit
          </button>

          <button className='profile-btn' onClick={()=>navigate(`/profile/mypost/${id}`)}>My Posts</button>
        </div>
        <button className='profile-btn' onClick={()=>navigate(`/post/save/${id}`)}>Saved Post</button>
      </div>
    </div>
  );
}
