import React from "react";
import { Link } from "react-router-dom";

const NavbarLinks = ({ authenticated, role, userId, handleLogout }) => {
  return (
    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
      {!authenticated ? (
        <>
          <li>
            <Link
              to="/login"
              className="block mt-1 md:hidden py-2 px-3 text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:p-0 text-base font-medium text-center"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="block mt-1 md:hidden py-2 px-3 text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:p-0 text-base font-medium text-center"
            >
              Register
            </Link>
          </li>
        </>
      ) : (
        <>
          {/* Mobile-only links */}
          <li className="md:hidden">
            <Link
              to={`/profile/${userId}`}
              className="block mt-1 py-2 px-3 text-gray-900 rounded-lg hover:bg-gray-100 text-base font-medium text-center"
            >
              Profile
            </Link>
          </li>
          <li className="md:hidden">
            <Link
              to={`/settings/${userId}`}
              className="block mt-1 py-2 px-3 text-gray-900 rounded-lg hover:bg-gray-100 text-base font-medium text-center"
            >
              Settings
            </Link>
          </li>

          {/* Common links for all authenticated users */}
          <li>
            <Link
              to="/global/leaderboard"
              className="block mt-1 py-2 px-3 text-gray-900 rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:p-0 text-base font-medium text-center"
            >
              Leaderboard
            </Link>
          </li>

          {/* Admin only link */}
          {role === "Admin" && (
            <li>
              <Link
                to="/quiz/admin"
                className="block mt-1 py-2 px-3 text-gray-900 font-bold rounded-lg hover:bg-gray-100 md:hover:bg-transparent md:p-0 text-base text-center"
              >
                QuizAdmin
              </Link>
            </li>
          )}
          <li className="md:hidden">
            <button
              onClick={handleLogout}
              className="block w-full mt-1 py-2 px-3 text-red-600 rounded-lg hover:bg-red-100 text-base font-medium text-center"
            >
              Logout
            </button>
          </li>
        </>
      )}
    </ul>
  );
};

export default NavbarLinks;
