import React from "react";
import { Link } from "react-router-dom";

const NavbarAuthButtons = () => (
  <>
    <Link to="/login">
      <button className="hidden md:inline-flex text-gray-900 border-gray-900 border-2 font-medium rounded-lg text-base px-4 py-2 mr-1 group">
        <span className="group-hover:-translate-y-1 transition-transform duration-150">
          Login
        </span>
      </button>
    </Link>
    <Link to="/register">
      <button className="hidden md:inline-flex text-gray-900 border-gray-900 border-2 font-medium rounded-lg text-base px-4 py-2 group">
        <span className="group-hover:-translate-y-1 transition-transform duration-150">
          Register
        </span>
      </button>
    </Link>
  </>
);

export default NavbarAuthButtons;
