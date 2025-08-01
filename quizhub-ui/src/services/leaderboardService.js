const API_URL = import.meta.env.VITE_BACKEND_API_URL;

import { createUserLeaderboardDto } from "../models/leaderboardModels";

export const fetchGlobalLeaderboard = async () => {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API_URL}/users/global-leaderboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to fetch leaderboard");
  }

  const json = await res.json();
  return json.users.map(createUserLeaderboardDto);
};
