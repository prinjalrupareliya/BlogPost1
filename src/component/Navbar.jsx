import React, { useState, useContext } from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import ConfirmationModal from "./ConfirmationModel";
import EditProfile from "../component/EditProfile";
import ModeContext from "../Context/ModeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const ctx = useContext(ModeContext)
  console.log(ctx,"Context Value")
  const loggedInUserData =
    JSON.parse(localStorage.getItem("loginData")) || {};

  const userInitial =
    loggedInUserData?.role?.charAt(0).toUpperCase() || "H";

  const [showModal, setShowModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const showModalHandler = () => setShowModal(true);
  const hideModalHandler = () => setShowModal(false);

  const logoutHandler = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("loginData");
    setShowModal(false);
    navigate("/login");
  };

  const openEditProfile = () => setShowEditProfile(true);
  const closeEditProfile = () => setShowEditProfile(false);

  return (
    <>
      <nav className ={`navbar ${ctx.mode == "dark" ? "dark-mode" : "light-mode"}`}>
        
        <h2>BlogPost</h2>

        <ul className="menu">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>
              Home
            </NavLink>
          </li>

          {loggedInUserData?.role === "admin" && (
            <li>
              <NavLink to="/new-post" className={({ isActive }) => isActive ? "active-link" : ""}>
                New Post
              </NavLink>
            </li>
          )}

          <li>
            <NavLink to="/explore-page" className={({ isActive }) => isActive ? "active-link" : ""}>
              Explore Post
            </NavLink>
          </li>

          <li>
            <span onClick={showModalHandler} style={{ cursor: "pointer" }}>
              Logout
            </span>
          </li>
        </ul>

        <div className="darkmode">
          <FaMoon />
          
          <span onClick={ctx.toggleMode} style={{ marginLeft: "9px" }}>{ctx.mode == "dark" ? "light" : "Dark"}</span>
          <div
            className="profile-class"
            onClick={openEditProfile}
            style={{ cursor: "pointer" }}
            title="Edit Profile"
          >
            {userInitial}
          </div>
        </div>
      </nav>

      {showModal && (
        <ConfirmationModal
          title="Logout?"
          desc="You are about to log out, are you sure?"
          onClose={hideModalHandler}
          onConfirm={logoutHandler}
          confirmBtnText="Logout"
        />
      )}

      {showEditProfile && (
        <EditProfile
          // userId={loggedInUserData.id}   {/* 🔥 ERROR FIX HERE */}
          onClose={closeEditProfile}
        />
      )}
    </>
  );
};

export default Navbar;
