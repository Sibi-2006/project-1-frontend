import NavBar from "./Components/NavBar.js";
import SignUp from "./Components/SignUp.js";
import Header from "./Components/Header.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./Components/SignIn.js";
import NewPost from "./Components/NewPost.js";
import MobileNav from "./Components/MobileNav.js";
import { PostProvider } from "./Context/PostContext.js";
import Home from "./Components/Home.js";
import Profile from "./Components/Profile.js";
import Edit from "./Components/Edit.js";
import Command from "./Components/Command.js";
import UserProfile from "./Components/UserProfile.js";
import OneUserPosts from "./Components/OneUserPosts.js";
import Mypost from "./Components/Mypost.js";
import Search from "./Components/Search.js";
import DeletePost from "./Components/DeletePost.js";
import EditPost from "./Components/EditPost.js";
import SavedPost from "./Components/SavedPost.js";
import About from "./Components/About.js"
import Followers from "./Components/Followers.js";
import Following from "./Components/Following.js";
function App() {
  return (
    <div>
      <PostProvider>
        <BrowserRouter>
          <Header />
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/command/:postId" element={<Command />} />
            <Route path="/command/userprofile/:id" element={<UserProfile />} />
            <Route path="/command/:id/oneuser" element={<OneUserPosts />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/newpost/:id" element={<NewPost />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/profile/edit/:id" element={<Edit />} />
            <Route path="/profile/mypost/:id" element={<Mypost />} />
            <Route path="/profile/mypost/deletepost/:postId" element={<DeletePost />} />
            <Route path="/profile/mypost/editpost/:postId" element={<EditPost />} />
            <Route path="/search" element={<Search />} />
            <Route path="/post/save/:id" element={<SavedPost />} />
            <Route path="/user/:id/followers" element={<Followers />} />
            <Route path="/user/:id/following" element={ <Following />} />
            <Route path="/about" element={<About/> } />
          </Routes>
          <MobileNav />
        </BrowserRouter>
      </PostProvider>
    </div>
  );
}

export default App;
