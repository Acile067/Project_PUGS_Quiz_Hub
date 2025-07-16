import React, { useEffect, useState } from "react";
import { getTopResultsForQuiz } from "../services/resultService";

const QuizLeaderboard = ({ quizId }) => {
  const [entries, setEntries] = useState([]);
  const [period, setPeriod] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log(
          "Fetching leaderboard for quiz:",
          quizId,
          "period:",
          period
        );
        const data = await getTopResultsForQuiz(quizId, period);
        setEntries(data.entries);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching leaderboard:", err);
      }
    };

    if (quizId) {
      fetchLeaderboard();
    }
  }, [quizId, period]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="pt-24 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Quiz Leaderboard</h1>

      <div className="mb-4">
        <label className="font-medium mr-2">Filter by period:</label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All time</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {entries.length === 0 ? (
        <p>No leaderboard data available.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Username</th>
              <th className="p-2">Score</th>
              <th className="p-2">Time</th>
              <th className="p-2">Completed At</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.position} className="border-t">
                <td className="p-2">{entry.position}</td>
                <td className="p-2">{entry.username}</td>
                <td className="p-2">{entry.score}</td>
                <td className="p-2">{formatTime(entry.timeElapsedSeconds)}</td>
                <td className="p-2">
                  {new Date(entry.completedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuizLeaderboard;
