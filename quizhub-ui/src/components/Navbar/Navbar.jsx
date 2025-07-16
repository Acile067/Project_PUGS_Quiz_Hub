import React, { useState, useEffect } from "react";
import NavbarLogo from "./NavbarLogo";
import NavbarAuthButtons from "./NavbarAuthButtons";
import NavbarProfileMenu from "./NavbarProfileMenu";
import NavbarLinks from "./NavbarLinks";
import NavbarMobileToggle from "./NavbarMobileToggle";
import {
  isAuthenticated,
  getUserIdFromToken,
  getUserRoleFromToken,
} from "../../services/authService";
import { fetchUserProfilePicture } from "../../services/userService";
import { createProfilePictureResponse } from "../../models/profilePictureResponseModel";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);

    if (auth) {
      setUserId(getUserIdFromToken());
      setRole(getUserRoleFromToken());

      const token = localStorage.getItem("access_token");
      fetchUserProfilePicture(token)
        .then((data) => {
          const parsed = createProfilePictureResponse(data);
          if (parsed.success && parsed.profilePicture) {
            const imageSrc = `data:${parsed.profilePictureContentType};base64,${parsed.profilePicture}`;
            setProfileImage(imageSrc);
          }
        })
        .catch(() => setProfileImage(null));
    }
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-20 transition-shadow bg-white bg-opacity-70 backdrop-blur-md ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavbarLogo />
        <div className="flex md:order-2 space-x-3 md:space-x-0">
          {!authenticated ? (
            <NavbarAuthButtons />
          ) : (
            <NavbarProfileMenu
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              profileImage={profileImage}
              userId={userId}
            />
          )}
          <NavbarMobileToggle
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMobileMenuOpen ? "block" : "hidden"
          }`}
          id="navbar-sticky"
        >
          <NavbarLinks
            authenticated={authenticated}
            userId={userId}
            role={role}
            handleLogout={() => {
              localStorage.removeItem("access_token");
              setAuthenticated(false);
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
