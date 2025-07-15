import React, { useEffect, useState } from "react";
import { getUserResults } from "../services/userService";
import { useNavigate } from "react-router-dom";

export const UserProfile = ({ userId }) => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getUserResults(userId);
        setResults(res.results);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchResults();
  }, [userId]);

  return (
    <div className="pt-24 max-w-4xl mx-auto px-4">
      <h2 className="text-xl font-semibold mb-3">My results</h2>
      {error && <p className="text-red-600">{error}</p>}

      {!Array.isArray(results) || results.length === 0 ? (
        <p>No results.</p>
      ) : (
        <table className="w-full border mt-2">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Quiz Name</th>
              <th className="p-2">Date</th>
              <th className="p-2">Score</th>
              <th className="p-2">See More</th>
            </tr>
          </thead>
          <tbody>
            {results.map((res) => (
              <tr key={res.id} className="border-t">
                <td className="p-2">{res.quizTitle}</td>
                <td className="p-2">
                  {new Date(res.completedAt).toLocaleString()}
                </td>
                <td className="p-2">
                  {res.correctAnswers}/{res.totalQuestions} ({res.score}%)
                </td>
                <td className="p-2">
                  <button
                    onClick={() => navigate(`/result/${res.id}`)}
                    className="text-blue-600 hover:underline"
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
