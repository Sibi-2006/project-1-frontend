import React, { useContext, useEffect, useState } from 'react'
import { PostContext } from "../Context/PostContext.js"
import { useParams } from 'react-router-dom'
import remove from "../assets/remove.jpg";
import command from "../assets/cat_command.jpg";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
export default function SavedPost() {
    const { id } = useParams();
    const { baseUrl } = useContext(PostContext);
    const [ savedPost , setSavedpost ] = useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{
        const getSavePost = async ()=>{
            try{
                const res = await axios.get(`${baseUrl}/post/user/${id}/save`);
                setSavedpost(res.data.savedPosts);
            }catch(err){
                console.log(err.message)
            }
            
        }
        getSavePost();
    },[baseUrl,id]);
    console.log("save : ",savedPost);
 
  return (
    <div className="flex justify-center flex-col items-center mx-auto w-full md:w-3/4 overflow-y-auto pt-20 pb-24 ">
      <h1 className='edit-title'>Saved post</h1>
      {savedPost.length > 0 ? (
        <div className="flex flex-col justify-center items-center gap-6 w-full">
          {savedPost.map((post) => (
            <div key={post._id} className="post-card">
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
                  className={`flex items-center gap-2 rounded-xl transition-colors duration-200 pr-4 bg-blue-400 hover:bg-blue-500 text-black `}  
                >
                  <img className="h-10 w-10 rounded-l-xl" src={remove} alt="like" />
                  Remove
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
        <p className="text-gray-600 mt-4">No saved posts yet.</p>
      )}
    </div>
  )
}
