import React, { useEffect, useState } from "react";
import { getAdminQuizzes } from "../services/quizService";
import { createQuizModel } from "../models/quizModels";
import { deleteQuiz } from "../services/quizService";
import { useNavigate } from "react-router-dom";

const difficultyColors = {
  1: { label: "Easy", color: "bg-green-500" },
  2: { label: "Medium", color: "bg-yellow-500" },
  3: { label: "Hard", color: "bg-red-500" },
};

const AdminQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getAdminQuizzes();
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch quizzes.");
        }

        setQuizzes(data.map(createQuizModel));
      } catch (err) {
        setError(err.message || "Unexpected error occurred.");
      }
    };

    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    try {
      const response = await deleteQuiz(quizId);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to delete quiz.");
      }
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    }
  };

  return (
    <div className="mt-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl text-center font-bold mb-4">Created Quizzes</h2>
      {error && (
        <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
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

            <div className="flex justify-between items-center px-4 pb-4 gap-2">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                onClick={() => navigate(`/quiz/edit/${quiz.id}`)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                onClick={() => handleDelete(quiz.id)}
              >
                Delete
              </button>
              <button
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                onClick={() => navigate(`/quiz/add-question/${quiz.id}`)}
              >
                Add Question
              </button>
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                onClick={() => navigate(`/quiz-result/admin/${quiz.id}`)}
              >
                See More
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

export default AdminQuizList;
