import React, { useEffect, useState } from "react";
import { fetchGlobalLeaderboard } from "../services/leaderboardService";

const GlobalLeaderboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const leaderboard = await fetchGlobalLeaderboard();
        setUsers(leaderboard);
      } catch (err) {
        setError(err.message || "Failed to load leaderboard");
      }
    };

    loadLeaderboard();
  }, []);

  if (error) {
    return <div className="pt-24 text-red-600">{error}</div>;
  }

  return (
    <div className="pt-24 max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Global Leaderboard
      </h1>
      <ul className="space-y-4">
        {users.map((user, index) => (
          <li
            key={index}
            className="flex items-center justify-between border p-4 rounded-md shadow-sm bg-white"
          >
            <div className="flex items-center gap-4">
              <img
                src={`data:${user.profilePictureContentType};base64,${user.profilePicture}`}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <span className="font-medium text-lg">{user.username}</span>
            </div>
            <span className="font-semibold text-blue-600 text-lg">
              {user.globalScore} pts
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GlobalLeaderboard;
