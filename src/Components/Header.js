import React from 'react'
import { Link , useNavigate } from 'react-router-dom';
import { clearAuth} from "../Server/storage.js"
import ICON from "../assets/icon.jpg";
export default function Header() {
  const data = JSON.parse(localStorage.getItem("aurth"));
  const navigate = useNavigate();
  const handleLogOut = ()=>{
    clearAuth();
    navigate("/signin");
  }
  return (
    <div className="w-full fixed top-0 z-50 hidden md:block">
     <header className="flex justify-between items-center bg-blue-500 text-white py-3 px-6 shadow-md">
      <div className=' flex flex-row justify-center items-center '>
          <img className=' h-10 w-10 rounded-full mr-2 border-2 border-blue-950' src={ICON} alt="icon" />
          <h2 className="text-2xl font-bold">SmartScroll</h2>
      </div>
      


  <p className="bg-white text-blue-600 font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-100 transition">
    {
      data ?(
      <button onClick={ handleLogOut }>Log-out</button>
    ):<Link to={"/signup"}>Sign-Up</Link>
    }
    
  </p>
</header>

    </div>
  );
}
