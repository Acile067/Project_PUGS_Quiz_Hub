import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarProfileMenu = ({
  isDropdownOpen,
  setIsDropdownOpen,
  profileImage,
  userId,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-11 h-11 rounded-full overflow-hidden border-2 border-gray-300"
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-400 animate-pulse"></div>
        )}
      </button>

      {isDropdownOpen && (
        <div
          onMouseLeave={() => setIsDropdownOpen(false)}
          className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50"
        >
          <Link
            to={`/profile/${userId}`}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <Link
            to={`/settings/${userId}`}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default NavbarProfileMenu;
