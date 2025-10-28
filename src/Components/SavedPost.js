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
    const [saved, setSaved] = useState(true);
    const [user , setUser ] = useState([])
//local user
 useEffect(() => {
    if (!id) return;
    const fetchLocalUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/user/${id}`);
        setUser(res.data.user);
        
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocalUser();
  }, [id, baseUrl]);

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

  const handleSave = async (post) => {
    const postId=post._id;
    if (!id) {
      navigate("/signup");
      return;
    }
    if (user.savedPosts?.includes(postId)) {
          setSaved(true);
        }
    

    try {
      if (!saved) {
        // save post
        await axios.post(`${baseUrl}/post/user/${id}/save/${postId}`);
        setSaved(true);
      } else {
        // unsave post
        await axios.patch(`${baseUrl}/post/user/${id}/unsave/${postId}`);
        setSaved(false);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
 
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
                  onClick={()=>handleSave(post)}
                >
                  <img className="h-10 w-10 rounded-l-xl" src={remove} alt="like" />
                 {saved ? <span>Remove</span> : <span>Save</span>}
                </button>


                <button className="flex items-center gap-2  rounded-xl bg-blue-400 hover:bg-blue-500 transition-colors duration-200 pr-4"  onClick={() => navigate(`/command/${post._id}`)}>
                  <img className="h-10 w-10 rounded-l-xl" src={command} alt="command" />
                  Read more...
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
