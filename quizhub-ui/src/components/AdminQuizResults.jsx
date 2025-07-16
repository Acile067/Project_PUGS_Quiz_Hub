import React, { useEffect, useState } from "react";
import { getQuizResultsByQuizId } from "../services/quizResultService";
import { useNavigate } from "react-router-dom";

const AdminQuizResults = ({ quizId }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getQuizResultsByQuizId(quizId);
        setResults(data);
      } catch (err) {
        setError(err.message);
      }
    };

    if (quizId) {
      fetchResults();
    }
  }, [quizId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="pt-24 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Quiz Results</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">User ID</th>
              <th className="p-2">Score</th>
              <th className="p-2">Time</th>
              <th className="p-2">Completed At</th>
              <th className="p-2">See More</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <tr key={res.id} className="border-t">
                <td className="p-2">{res.userId}</td>
                <td className="p-2">
                  {res.correctAnswers}/{res.totalQuestions} ({res.score}%)
                </td>
                <td className="p-2">{formatTime(res.timeElapsedSeconds)}</td>
                <td className="p-2">
                  {new Date(res.completedAt).toLocaleString()}
                </td>
                <td className="p-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => navigate(`/result/details/${res.id}/admin`)}
                  >
                    See More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminQuizResults;
