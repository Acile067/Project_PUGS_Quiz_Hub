import React from "react";

export const UserProfile = ({ userId }) => {
  return (
    <div className="pt-24">
      <h1>User Profile</h1>
      <p>User ID: {userId}</p>
    </div>
  );
};
