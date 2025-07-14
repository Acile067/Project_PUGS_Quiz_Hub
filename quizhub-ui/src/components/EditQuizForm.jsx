import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizByIdWithAnswers, updateQuiz } from "../services/quizService";
import { deleteQuestion as deleteQuestionApi } from "../services/questionService";
import { createFieldErrorObject } from "../models/fieldErrorModel";
import { createEditQuizRequest } from "../models/editQuizRequestModel";

const EditQuizForm = () => {
  const { quizId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    timeLimitSeconds: 60,
    difficulty: 1,
    questions: [],
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      const { ok, data } = await getQuizByIdWithAnswers(quizId);
      if (!ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setFieldErrors(createFieldErrorObject(data.errors));
        } else {
          setGeneralError(
            data.message || data.detail || "Failed to load quiz."
          );
        }
        return;
      }

      setFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        timeLimitSeconds: data.timeLimitSeconds,
        difficulty: data.difficulty,
        questions: data.questions,
      });
    };

    fetchQuiz();
  }, [quizId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: null }));
    setFormData((prev) => ({
      ...prev,
      [name]: ["timeLimitSeconds", "difficulty"].includes(name)
        ? parseInt(value, 10)
        : value,
    }));
  };

  const updateQuestion = (index, updatedQuestion) => {
    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        ...updatedQuestion,
      };
      return { ...prev, questions: updatedQuestions };
    });
  };

  const updateOption = (questionIndex, optionIndex, newValue) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      const updatedOptions = [...questions[questionIndex].options];
      updatedOptions[optionIndex] = newValue;
      questions[questionIndex].options = updatedOptions;
      return { ...prev, questions };
    });
  };

  const handleDeleteQuestion = async (questionId, index) => {
    if (questionId) {
      const { ok, data } = await deleteQuestionApi(questionId);
      if (!ok) {
        setGeneralError(data.detail || "Failed to delete question.");
        return;
      }
    }

    setFormData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions.splice(index, 1);
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setSuccessMessage("");

    const payload = createEditQuizRequest({
      id: quizId,
      ...formData,
    });

    const { ok, data } = await updateQuiz(quizId, payload);
    if (!ok) {
      if (data.errors && Array.isArray(data.errors)) {
        setFieldErrors(createFieldErrorObject(data.errors));
      } else {
        setGeneralError(
          data.message || data.detail || "Failed to update quiz."
        );
      }
      return;
    }

    setSuccessMessage("Quiz updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto mt-24 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Quiz</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["title", "description", "category"].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
            {fieldErrors[field] && (
              <p className="text-red-500 text-sm">{fieldErrors[field]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block font-semibold">Time Limit (seconds)</label>
          <input
            type="number"
            name="timeLimitSeconds"
            value={formData.timeLimitSeconds}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Difficulty (1-3)</label>
          <input
            type="number"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            min={1}
            max={3}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <hr className="my-6" />

        <h3 className="text-xl font-semibold">Questions</h3>
        {formData.questions.map((q, idx) => (
          <div key={q.id || idx} className="border p-4 rounded mb-4 bg-gray-50">
            <label className="block font-medium">Question {idx + 1}</label>
            <input
              type="text"
              value={q.text}
              onChange={(e) => updateQuestion(idx, { text: e.target.value })}
              className="w-full px-3 py-2 border rounded mb-2"
            />
            <p className="text-sm text-gray-600 mb-2">Type: {q.type}</p>

            {["SingleChoice", "MultipleChoice"].includes(q.type) && (
              <>
                {q.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(idx, i, e.target.value)}
                      className="flex-1 px-2 py-1 border rounded"
                    />
                    {q.type === "SingleChoice" ? (
                      <input
                        type="radio"
                        checked={q.correctOptionIndex === i}
                        onChange={() =>
                          updateQuestion(idx, { correctOptionIndex: i })
                        }
                      />
                    ) : (
                      <input
                        type="checkbox"
                        checked={q.correctOptionIndices?.includes(i)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(q.correctOptionIndices || []), i]
                            : q.correctOptionIndices.filter((val) => val !== i);
                          updateQuestion(idx, {
                            correctOptionIndices: updated,
                          });
                        }}
                      />
                    )}
                    <span className="text-sm">Correct</span>
                  </div>
                ))}
              </>
            )}

            {q.type === "TrueFalse" && (
              <div className="flex gap-4 mt-2">
                {["True", "False"].map((val) => (
                  <label key={val} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={q.correctAnswerBool === (val === "True")}
                      onChange={() =>
                        updateQuestion(idx, {
                          correctAnswerBool: val === "True",
                        })
                      }
                    />
                    {val}
                  </label>
                ))}
              </div>
            )}

            {q.type === "FillInTheBlank" && (
              <input
                type="text"
                value={q.correctAnswerText}
                onChange={(e) =>
                  updateQuestion(idx, { correctAnswerText: e.target.value })
                }
                className="w-full px-3 py-1 border rounded mt-2"
              />
            )}

            <button
              type="button"
              onClick={() => handleDeleteQuestion(q.id, idx)}
              className="text-sm text-red-600 hover:underline mt-3 inline-block"
            >
              Delete Question
            </button>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>

        {generalError && (
          <p className="text-red-600 mt-3 text-center">{generalError}</p>
        )}
        {successMessage && (
          <p className="text-green-600 mt-3 text-center">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default EditQuizForm;
