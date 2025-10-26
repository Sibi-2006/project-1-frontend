import axios from "axios";
import React, { useState , useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isaurth, Add_Use_id } from "../Server/storage.js";
import { PostContext } from "../Context/PostContext.js"

export default function SignUp() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ userName: "", userId: "", password: "" });
  const [message, setMessage] = useState("");
  const [userError, setUserError] = useState({
    userName_error: { required: false, message: "Please enter User Name" },
    userId_error: { required: false, message: "Please enter User ID" },
    password_error: { required: false, message: "Please enter Password" }
  });
  const { baseUrl } = useContext(PostContext)

  const handleChange = (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateFields = () => {
    const newError = {
      userName_error: { ...userError.userName_error, required: !user.userName },
      userId_error: { ...userError.userId_error, required: !user.userId },
      password_error: { ...userError.password_error, required: !user.password }
    };
    setUserError(newError);
    return user.userName && user.userId && user.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/form`, user);
      isaurth(true);
      Add_Use_id(res.data.user); // ✅ store user info
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error registering user");
    }

    setUser({ userName: "", userId: "", password: "" });
  };

  return (
    <div className="parent">
      <form className="child" onSubmit={handleSubmit}>
        <h1 className="title-form">Sign-Up</h1>

        <input type="text" placeholder="User Name" name="userName" className="inputs" value={user.userName} onChange={handleChange} />
        {userError.userName_error.required && <p className="error-message">{userError.userName_error.message}</p>}

        <input type="text" placeholder="User ID" name="userId" className="inputs" value={user.userId} onChange={handleChange} />
        {userError.userId_error.required && <p className="error-message">{userError.userId_error.message}</p>}

        <input type="password" placeholder="Password" name="password" className="inputs" value={user.password} onChange={handleChange} />
        {userError.password_error.required && <p className="error-message">{userError.password_error.message}</p>}

        {message && <p className="msg">{message}</p>}
        <p>Have an account? <Link to="/signin" className="linkes">Sign-In</Link></p>
        <button type="submit" className="form-btn">Sign Up</button>
      </form>
    </div>
  );
}
