import axios from "axios";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isaurth, Add_Use_id } from "../Server/storage.js";
import { PostContext } from "../Context/PostContext.js";

export default function SignUp() {
  const navigate = useNavigate();
  const { baseUrl } = useContext(PostContext);

  const [user, setUser] = useState({ userName: "", userId: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [userError, setUserError] = useState({
    userName_error: { required: false, message: "Please enter User Name" },
    userId_error: { required: false, message: "Please enter User ID" },
    password_error: { required: false, message: "Please enter Password" },
  });

  // Handle input change
  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value.trimStart(),
    }));
  };

  // Validate empty fields
  const validateFields = () => {
    const newError = {
      userName_error: {
        ...userError.userName_error,
        required: !user.userName,
      },
      userId_error: {
        ...userError.userId_error,
        required: !user.userId,
      },
      password_error: {
        ...userError.password_error,
        required: !user.password,
      },
    };
    setUserError(newError);
    return user.userName && user.userId && user.password;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) {
      setMessage("Please fill all fields");
      return;
    }

    // Length validations
    if (user.userId.length >= 20) {
      setMessage("User ID must be less than 20 characters");
      return;
    }
    if (user.userName.length >= 30) {
      setMessage("User Name must be less than 30 characters");
      return;
    }
    if (user.password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    if (loading) return; // Prevent double submit
    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/form`, user);
      isaurth(true);
      Add_Use_id(res.data.user);
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Error registering user");
    } finally {
      setLoading(false);
    }

    setUser({ userName: "", userId: "", password: "" });
  };

  return (
    <div className="parent">
      <div className=" my-5">
        <button className=" bg-blue-700 text-white py-3 px-4 border-2 border-black rounded-s-xl cursor-not-allowed">signUp</button>
        <button className=" bg-blue-100 text-black py-3 px-4 border-2 border-black rounded-e-xl" onClick={()=>navigate('/signin')}>SignIn</button>
      </div>
      <form className="child" onSubmit={handleSubmit}>
        <h1 className="title-form">Sign-Up</h1>

        {/* User Name */}
        <input
          type="text"
          placeholder="User Name"
          name="userName"
          className="inputs"
          value={user.userName}
          onChange={handleChange}
        />
        {userError.userName_error.required && (
          <p className="error-message">{userError.userName_error.message}</p>
        )}

        {/* User ID */}
        <input
          type="text"
          placeholder="User ID"
          name="userId"
          className="inputs"
          value={user.userId}
          onChange={handleChange}
        />
        {userError.userId_error.required && (
          <p className="error-message">{userError.userId_error.message}</p>
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="inputs"
          value={user.password}
          onChange={handleChange}
        />
        {userError.password_error.required && (
          <p className="error-message">{userError.password_error.message}</p>
        )}

        {/* Message */}
        {message && <p className=" text-red-400">{message}</p>}

        {/* Navigation */}
        <p>
          Have an account?{" "}
          <Link to="/signin" className="linkes">
            Sign-In
          </Link>
        </p>

        {/* Button */}
        <button type="submit" className="form-btn" disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
