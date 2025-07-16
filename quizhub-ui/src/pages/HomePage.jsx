import React from "react";
import { isAuthenticated } from "../services/authService";
import GuestHomeContent from "../components/Hero/GuestHomeContent";
import UserHomeContent from "../components/Hero/UserHomeContent";

const HomePage = () => {
  return (
    <div className="pt-30 px-4 ">
      {isAuthenticated() ? <UserHomeContent /> : <GuestHomeContent />}
    </div>
  );
};

export default HomePage;
