import React, { useState } from "react";
import { FaHome, FaHeart, FaMusic, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "/src/assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-[#A35D4E] text-white p-4 flex items-center justify-between border-b-4 border-white z-50">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Event Music Selector" className="h-14" />
      </div>

      <div className="lg:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu Items (Desktop) */}
      <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 mt-4 space-x-6 text-xl">
        <NavItem onClick={() => navigate("/")} icon={<FaHome />} label="Home" />
        <NavItem onClick={() => navigate("/playlist")} icon={<FaMusic />} label="Playlist" />
        <NavItem onClick={() => navigate("/Favorite")} icon={<FaHeart />} label="Favorite" />
      </div>

      {/* Dropdown Menu (Mobile) */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#A35D4E] flex flex-col items-center space-y-4 py-4 text-lg shadow-lg">
          <NavItem onClick={() => { navigate("/"); setIsMenuOpen(false); }} icon={<FaHome />} label="Home" />
          <NavItem onClick={() => { navigate("/playlist"); setIsMenuOpen(false); }} icon={<FaMusic />} label="Playlist" />
          <NavItem onClick={() => { navigate("/Favorite"); setIsMenuOpen(false); }} icon={<FaHeart />} label="Favorite" />
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ onClick, icon, label }) => (
  <div
    onClick={onClick}
    className="flex items-center space-x-2 cursor-pointer hover:text-yellow-300"
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default Navbar;
