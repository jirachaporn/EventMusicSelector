import React from "react";
import { FaHome, FaHeart, FaMusic, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 bg-[#A35D4E] text-white p-4 flex items-center justify-between border-b-4 border-white z-50">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Event Music Selector" className="h-14" />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 mt-4 flex space-x-6 text-xl">
      <NavItem onClick={() => navigate("/")} icon={<FaHome />} label="Home" />
        <NavItem onClick={() => navigate("/playlist")} icon={<FaMusic />} label="Playlist" />
        <NavItem onClick={() => navigate("/Favorite")} icon={<FaHeart />} label="Favorite" />
      </div>

      <FaUserCircle className="text-3xl" />
    </nav>
  );
};

const NavItem = ({ onClick, icon, label }) => (
  <div onClick={onClick} className="flex items-center space-x-1 cursor-pointer hover:text-yellow-300">
    {icon}
    <span>{label}</span>
  </div>
);

export default Navbar;
