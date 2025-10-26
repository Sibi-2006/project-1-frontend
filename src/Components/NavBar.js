import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { get_use_id, clearAuth } from "../Server/storage.js";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  
  const data = JSON.parse(localStorage.getItem("aurth") || "null");
  const user = get_use_id();
  const id = user?.id; 

  
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  //  Handle logout
  const handleLogOut = () => {
    clearAuth();
    navigate("/signin");
  };

  return (
    <>
      {/*  Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-blue-500 text-white flex justify-between items-center p-4 z-50 shadow-md">
        <h2 className="text-2xl font-bold">SmartScroll</h2>
        <button onClick={() => setOpen(!open)} className="focus:outline-none">
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/*  Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-3/12 bg-blue-300 shadow-md z-40">
        <nav className="flex flex-col items-center justify-center h-full space-y-6 w-full">
          <ul className="text-2xl font-medium w-full text-center space-y-6">
            <li>
              <Link
                to="/"
                className="w-full block hover:bg-blue-400 py-3 rounded-lg transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to={id ? `/newpost/${id}` : "/signin"} 
                className="w-full block hover:bg-blue-400 py-3 rounded-lg transition"
              >
                Post
              </Link>
            </li>

            <li>
              <Link
                to={id ? `/profile/${id}` : "/signin"} 
                className="block hover:bg-blue-400 py-3 rounded-lg transition"
              >
                Profile
              </Link>
            </li>

            <li>
              <Link
                to={'/search'} 
                className="block hover:bg-blue-400 py-3 rounded-lg transition"
              >
                Search
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="block hover:bg-blue-400 py-3 rounded-lg transition"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Mobile  */}
      <div
        className={`fixed top-0 left-0 h-full w-8/12 bg-blue-300 text-black transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 md:hidden shadow-lg`}
      >
        <nav className="flex flex-col items-center justify-center h-full space-y-6">
          <ul className="text-2xl font-medium w-full text-center space-y-6">
            <li>
              <Link
                to="/"
                className="block hover:bg-blue-400 py-3 rounded-lg transition"
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to={id ? `/newpost/${id}` : "/signin"}
                className="block hover:bg-blue-400 py-3 rounded-lg transition"
                onClick={() => setOpen(false)}
              >
                Post
              </Link>
            </li>

            <li>
              <Link
                to={id ? `/profile/${id}` : "/signin"}
                className="block hover:bg-blue-400 py-3 rounded-lg transition"
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
            </li>

            <li>
              {data ? (
                <button
                  onClick={() => {
                    handleLogOut();
                    setOpen(false);
                  }}
                  className="block w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  to="/signup"
                  className="block hover:bg-blue-400 py-3 rounded-lg transition"
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Link>
              )}
            </li>

            <li>
              <Link
                to="/about"
                className="block hover:bg-blue-400 py-3 rounded-lg transition"
                onClick={() => setOpen(false)}
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/*  Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
