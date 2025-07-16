import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { animateScroll } from "react-scroll";

const NavbarLogo = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = () => {
    if (location.pathname === "/") {
      animateScroll.scrollToTop({ duration: 500, smooth: true });
    } else {
      navigate("/");
      setTimeout(() => {
        animateScroll.scrollToTop({ duration: 500, smooth: true });
      }, 200);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-3 rtl:space-x-reverse"
    >
      <span className="self-center text-2xl font-semibold whitespace-nowrap transition duration-200 ease-in-out hover:text-secondary">
        QuizHub
      </span>
    </button>
  );
};

export default NavbarLogo;
