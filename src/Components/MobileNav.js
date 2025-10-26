import React from 'react'
import { Search, HomeIcon, Plus } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import profile from "../assets/pfp.jpg"
import { get_use_id } from "../Server/storage.js";

export default function MobileNav() {
  const user = get_use_id();
  const id = user?.id;
  const navigate = useNavigate();

  return (
    <div className='md:hidden fixed bottom-0 w-full'>
      

      <nav className='flex flex-row items-center justify-between bg-blue-500 py-2'>
        <div className='icons' onClick={() => navigate('/')}>
          <HomeIcon size={28} />
        </div>

        <div className="border-2 rounded-full flex items-center justify-center p-1 border-black">
          <button onClick={() => navigate('/search')}>
            <Search size={28} />
          </button>
        </div>

        <div className='icons' onClick={() => navigate(`/newpost/${id}`)}>
          <Plus size={28} />
        </div>

        <div onClick={() => navigate(`/profile/${id}`)}>
          <img className='w-10 h-10 rounded-full border-2 border-black mr-2' src={profile} alt="" />
        </div>
      </nav>
    </div>
  );
}
