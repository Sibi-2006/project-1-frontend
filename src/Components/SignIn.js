import axios from "axios";
import React, { useState , useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isaurth, Add_Use_id } from "../Server/storage.js";
import { PostContext } from "../Context/PostContext.js"

export default function SignIn() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ userId: "", password: "" });
  const [message, setMessage] = useState("");
    const { baseUrl } = useContext(PostContext)
  
  const [userError, setUserError] = useState({
    userId_error: { required: false, message: "Please enter User ID" },
    password_error: { required: false, message: "Please enter Password" }
  });

  const handleChange = (e) => setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateFields = () => {
    const newError = {
      userId_error: { ...userError.userId_error, required: !user.userId },
      password_error: { ...userError.password_error, required: !user.password }
    };
    setUserError(newError);
    return user.userId && user.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/form/signin`, user);
      console.log("Login response:", res.data);

      if (res.data.message) {
        isaurth(true);
        Add_Use_id(res.data.user);
        setMessage(res.data.message);
        setTimeout(() => navigate("/"), 1000);
      } else if (res.data.error) {
        setMessage(res.data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Server error, try again later");
    }

    setUser({ userId: "", password: "" });
  };

  return (
    <div className="parent">
      <form className="child" onSubmit={handleSubmit}>
        <h1 className="title-form">Sign-In</h1>

        <input type="text" placeholder="User Id" name="userId" className="inputs" value={user.userId} onChange={handleChange} />
        {userError.userId_error.required && <p className="error-message">{userError.userId_error.message}</p>}

        <input type="password" placeholder="Password" name="password" className="inputs" value={user.password} onChange={handleChange} />
        {userError.password_error.required && <p className="error-message">{userError.password_error.message}</p>}

        <p>Don't have an account? <Link to="/signup" className="linkes">Sign-Up</Link></p>
        {message && <p className="msg">{message}</p>}

        <button className="form-btn">Sign In</button>
      </form>
    </div>
  );
}
