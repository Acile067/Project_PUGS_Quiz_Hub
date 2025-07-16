import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const difficultyColors = {
  1: { label: "Easy", color: "bg-green-500" },
  2: { label: "Medium", color: "bg-yellow-500" },
  3: { label: "Hard", color: "bg-red-500" },
};

const ListAllQuizzes = ({ quizzes = [] }) => {
  const [localQuizzes, setLocalQuizzes] = useState(quizzes);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLocalQuizzes(quizzes);
  }, [quizzes]);

  return (
    <div className="mt-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl text-center font-bold mb-4">Available Quizzes</h2>
      {error && (
        <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {localQuizzes.length === 0 && (
          <p className="text-center col-span-full">No quizzes found.</p>
        )}
        {localQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white shadow-md rounded-lg flex flex-col justify-between"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold">{quiz.title}</h3>
              <p className="text-gray-600 mt-2">{quiz.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Category: {quiz.category}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Time Limit: {quiz.timeLimitSeconds} seconds
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Questions: {quiz.questionCount}
              </p>
            </div>

            <div className="flex justify-center gap-3 px-4 pb-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                onClick={() => navigate(`/quiz/start/${quiz.id}`)}
              >
                Start Quiz
              </button>
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                onClick={() => navigate(`/quiz/${quiz.id}/leaderboard`)}
              >
                Leaderboard
              </button>
            </div>

            <div
              className={`w-full text-center py-2 text-white font-semibold ${
                difficultyColors[quiz.difficulty]?.color || "bg-gray-400"
              }`}
            >
              {difficultyColors[quiz.difficulty]?.label || "Unknown"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAllQuizzes;
