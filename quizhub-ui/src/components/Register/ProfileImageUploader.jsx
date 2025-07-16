// ProfileImageUploader.jsx
import React from "react";

const ProfileImageUploader = ({ preview, onChange, error }) => {
  return (
    <div className="flex flex-col items-center">
      <label htmlFor="ProfilePicture" className="relative cursor-pointer group">
        <img
          src={preview || "https://avatars.githubusercontent.com/u/583231?v=4"}
          alt="Profile Preview"
          className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 group-hover:opacity-80 transition"
        />
        <input
          type="file"
          id="ProfilePicture"
          name="ProfilePicture"
          accept="image/*"
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="absolute bottom-0 w-full text-center text-sm text-white bg-black bg-opacity-50 rounded-b-full py-1 hidden group-hover:block">
          Change
        </div>
      </label>
      {error && (
        <p className="text-red-500 text-sm text-center mt-2">{error}</p>
      )}
    </div>
  );
};

export default ProfileImageUploader;
