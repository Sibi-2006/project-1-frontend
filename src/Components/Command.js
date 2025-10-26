import React, { useEffect, useState , useContext } from "react";
import { useParams ,useNavigate } from "react-router-dom";
import axios from "axios";
import { get_use_id } from "../Server/storage.js"
import { PostContext } from "../Context/PostContext.js"
import SAVE from "../assets/catSave.png"
export default function Command() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const { baseUrl } = useContext(PostContext)
  const navigate = useNavigate();
  const localUser = get_use_id();
  const userId= localUser?.id;
  const [isOpen , setIsOpen ]= useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/${postId}`);
        setPost(res.data.post);
        setReplies(res.data.post.reply || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPost();
  }, [postId,baseUrl]);

  const handleAddReply = async () => {
    if (!newReply.trim()) return;
    try {
      const res = await axios.post(`${baseUrl}/post/${postId}/reply`, { reply_content: newReply });
      setReplies([...replies, res.data.reply]);
      setNewReply("");
    } catch (err) {
      console.error(err);
    }
  };
  const handleSave = async ()=>{

    if(!userId || userId===null){
      navigate("/signup");
      return;
    }

    try{
      await axios.post(`${baseUrl}/post/user/${userId}/save/${postId}`)
      
    }catch(err){
      console.log(err.message);
    }
    
  }

  if (!post) return <p>Loading post...</p>;

  return (
    <div className="command-main">
      <div className="command-child">
        <h2 className="text-2xl font-bold post-title px-4">{post.title}</h2>
        <p className=" text-blue-900 px-5">{post.content}</p>
        <p className="text-sm text-gray-500 mb-5 px-5">- by {post.userName}</p>
        <div className="px-5 flex flex-col justify-center items-start md:items-center md:gap-4 md:flex-row">
          <button className="profile-btn" onClick={()=>navigate(`/command/userprofile/${post.userId}`)}> see {post.userName} profile</button>
          <button className="save-btn" onClick={handleSave}>
                <img className="h-10 w-10 rounded-l-xl" src={SAVE} alt="save" />
                <p className=" px-4"> Save Post</p>
          </button>
        </div>
        <div className=" flex items-center justify-center">
            <button className="btn" onClick={()=>setIsOpen(!isOpen)}>Read Replies</button>
        </div>
        
    {
      isOpen&&(
          <div className={`replies transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
          <h3 className="text-xl font-semibold mb-2">Replies:</h3>
          {replies.length === 0 ? <p>No replies yet</p> : replies.map((r, idx) => (
            <p key={idx} className="border p-2 rounded mb-2 ">{r.reply_content}</p>
          ))}
        </div>
      )
    }
        

        <div className="h-20 md:h-12 w-full"></div>
        <div className=" fixed bottom-16 md:bottom-0 bg-blue-300  mx-auto px-5 md:w-2/4 py-3 rounded-2xl ">
          <div className="flex gap-2 md:mx-5">
            <input
              type="text"
              placeholder="Add a reply..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              className="border rounded px-2 py-1 flex-1"
            />
            <button onClick={handleAddReply} className="bg-blue-500 text-white px-3 rounded">
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
