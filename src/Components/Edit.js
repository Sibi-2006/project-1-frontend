import React, { useEffect, useState , useContext  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PostContext } from "../Context/PostContext.js"

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { baseUrl } = useContext(PostContext)
  
  const [user, setUser] = useState({
    userName: "",
    userId: "",
    bio: ""
  });

  const [errors, setErrors] = useState({
    userName: { message: "", require: false },
    userId: { message: "", require: false },
    bio: { message: "", require: false }
  });

  const [updateMessage, setUpdateMessage] = useState({
    message: "",
    require: false,
    isSuccess: false
  });

  useEffect(() => {
    const findUser = async () => {
      try {
        const res = await axios.get(`${baseUrl}/post/user/${id}`);
        setUser(res.data.user);
      } catch (err) {
        console.log(err.message);
      }
    };
    findUser();
  }, [id,baseUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      userName: { message: "", require: false },
      userId: { message: "", require: false },
      bio: { message: "", require: false },
    };

    if (!user.userName.trim()) {
      newErrors.userName = { message: "Username is required", require: true };
    }
    if (!user.userId.trim()) {
      newErrors.userId = { message: "User ID is required", require: true };
    }
    if (!user.bio.trim()) {
      newErrors.bio = { message: "Bio cannot be empty", require: true };
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err.require)) return;

    try {
      await axios.patch(`${baseUrl}/form/${id}`, user);
      setUpdateMessage({
        message: "User updated successfully!",
        require: true,
        isSuccess: true
      });

      setTimeout(() => {
        navigate(`/profile/${id}`);
      }, 1500);

    } catch (err) {
      console.log(err.message);
      setUpdateMessage({
        message: "Update failed!",
        require: true,
        isSuccess: false
      });
    }
  };

  return (
    <div className="parent">
      <form className="child" onSubmit={handleSubmit}>
        <h2 className="title-form">--- Edit Profile ---</h2>

        <input
          type="text"
          name="userName"
          placeholder="User Name"
          value={user.userName}
          onChange={handleChange}
          className="inputs"
        />
        {errors.userName.require && (
          <p className="text-red-400 text-sm">{errors.userName.message}</p>
        )}

        <input
          type="text"
          name="userId"
          placeholder="User Id"
          value={user.userId}
          onChange={handleChange}
          className="inputs"
        />
        {errors.userId.require && (
          <p className="text-red-400 text-sm">{errors.userId.message}</p>
        )}

        <textarea
          name="bio"
          placeholder="Bio"
          value={user.bio}
          onChange={handleChange}
          className="post-contant"
        ></textarea>
        {errors.bio.require && (
          <p className="text-red-400 text-sm">{errors.bio.message}</p>
        )}

        {updateMessage.require && (
          <p
            className={
              updateMessage.isSuccess
                ? "text-green-400 text-left p-0 -m-2"
                : "text-red-400 p-0 -m-2"
            }
          >
            {updateMessage.message}
          </p>
        )}

        <button type="submit" className="form-btn">Update</button>
      </form>
    </div>
  );
}
