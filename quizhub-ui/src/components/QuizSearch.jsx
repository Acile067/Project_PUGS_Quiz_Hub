import React, { useEffect, useState } from "react";
import { getAllCategories, getAllQuizzes } from "../services/quizService";
import { createQuizModel } from "../models/quizModels";
import ListAllQuizzes from "./ListAllQuizes";

const QuizSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch categories.");
        }
        setCategories(data.categories);
      } catch (err) {
        setError(err.message || "Unexpected error occurred.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch all quizzes once on mount (bez filtera)
  useEffect(() => {
    const fetchQuizzesOnMount = async () => {
      setError("");
      try {
        const response = await getAllQuizzes({});
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch quizzes.");
        }
        setQuizzes(data.map(createQuizModel));
      } catch (err) {
        setError(err.message || "Unexpected error occurred.");
      }
    };
    fetchQuizzesOnMount();
  }, []);

  // Search handler (sa filterima)
  const handleSearch = async () => {
    setError("");
    try {
      const response = await getAllQuizzes({
        keyword: keyword.trim(),
        category: category || undefined,
        difficulty: difficulty || undefined,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch quizzes.");
      }
      setQuizzes(data.map(createQuizModel));
    } catch (err) {
      setError(err.message || "Unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex flex-col flex-grow min-w-[200px]">
          <label className="mb-1 font-semibold">Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by title or description"
            className="border px-3 py-2 rounded"
          />
        </div>

        <div className="flex flex-col min-w-[150px]">
          <label className="mb-1 font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col min-w-[150px]">
          <label className="mb-1 font-semibold">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Levels</option>
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
        </div>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {error && (
        <p className="text-red-600 mb-4 text-center font-semibold">{error}</p>
      )}

      <ListAllQuizzes quizzes={quizzes} />
    </div>
  );
};

export default QuizSearch;
