import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQuizRequest } from "../models/createQuizRequestModel";
import { createQuiz } from "../services/quizService";
import { createFieldErrorObject } from "../models/fieldErrorModel";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [timeLimitSeconds, setTimeLimitSeconds] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setSuccessMessage("");

    const difficultyValue = parseInt(difficulty, 10);
    if (difficultyValue < 1 || difficultyValue > 3) {
      setFieldErrors({ Difficulty: "Difficulty must be between 1 and 3." });
      return;
    }

    const request = createQuizRequest(
      title,
      description,
      category,
      parseInt(timeLimitSeconds, 10),
      difficultyValue
    );

    try {
      const response = await createQuiz(request);
      let data;

      try {
        data = await response.json();
      } catch {
        data = { ExceptionMessage: await response.text() };
      }

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setFieldErrors(createFieldErrorObject(data.errors));
        } else {
          setFieldErrors({
            general:
              data.message ||
              data.ExceptionMessage ||
              data.detail ||
              "Quiz creation failed",
          });
        }
        return;
      }

      setSuccessMessage(data.message || "Quiz created successfully!");
      // optionally navigate:
      // navigate("/dashboard");
    } catch (error) {
      setFieldErrors({ general: "Network error or server unavailable" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Create Quiz</h2>

        {["Title", "Description", "Category"].map((field) => (
          <div key={field}>
            <label className="block text-gray-700 font-medium mb-1">
              {field}
            </label>
            <input
              type="text"
              value={eval(field.toLowerCase())}
              onChange={(e) => {
                setFieldErrors((prev) => ({ ...prev, [field]: null }));
                switch (field) {
                  case "Title":
                    setTitle(e.target.value);
                    break;
                  case "Description":
                    setDescription(e.target.value);
                    break;
                  case "Category":
                    setCategory(e.target.value);
                    break;
                }
              }}
              className="w-full px-4 py-2 border rounded-md"
              placeholder={`Enter ${field.toLowerCase()}`}
              required
            />
            {fieldErrors[field] && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors[field]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Time Limit (seconds)
          </label>
          <input
            type="number"
            value={timeLimitSeconds}
            onChange={(e) => {
              setTimeLimitSeconds(e.target.value);
              setFieldErrors((prev) => ({ ...prev, TimeLimitSeconds: null }));
            }}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          {fieldErrors.TimeLimitSeconds && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.TimeLimitSeconds}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Difficulty (1-3)
          </label>
          <input
            type="number"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setFieldErrors((prev) => ({ ...prev, Difficulty: null }));
            }}
            className="w-full px-4 py-2 border rounded-md"
            required
            min={1}
            max={3}
          />
          {fieldErrors.Difficulty && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.Difficulty}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Quiz
        </button>

        {fieldErrors.general && (
          <p className="text-red-600 mt-4 text-center font-semibold">
            {fieldErrors.general}
          </p>
        )}
        {successMessage && (
          <p className="text-green-600 mt-4 text-center font-semibold">
            {successMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateQuiz;
