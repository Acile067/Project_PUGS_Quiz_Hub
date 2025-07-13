import React from "react";
import { isAuthenticated } from "../services/authService";
import GuestHomeContent from "../components/GuestHomeContent";
import UserHomeContent from "../components/UserHomeContent";

const HomePage = () => {
  return (
    <div className="pt-60 px-4">
      {isAuthenticated() ? <UserHomeContent /> : <GuestHomeContent />}
    </div>
  );
};

export default HomePage;
