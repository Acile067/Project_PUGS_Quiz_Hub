// components/EditQuiz.jsx
import React, { useEffect, useState } from "react";
import { getQuizByIdWithAnswers } from "../services/quizService";
import { createQuizWithAnswersModel } from "../models/getQuizByIdWithAnswersResponseModel";
import { useNavigate } from "react-router-dom";
import { createFieldErrorObject } from "../models/fieldErrorModel";

const EditQuiz = ({ quizId }) => {
  const [quiz, setQuiz] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

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
        setLoading(false);
        return;
      }

      setQuiz(createQuizWithAnswersModel(data));
      setLoading(false);
    };

    fetchQuiz();
  }, [quizId]);

  if (loading) return <p className="text-center mt-10">Loading quiz...</p>;
  if (!quiz)
    return <p className="text-center text-red-600 mt-10">{generalError}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Edit Quiz: {quiz.title}
      </h2>

      <p className="mb-2">
        <strong>Description:</strong> {quiz.description}
      </p>
      <p className="mb-2">
        <strong>Category:</strong> {quiz.category}
      </p>
      <p className="mb-2">
        <strong>Time Limit:</strong> {quiz.timeLimitSeconds} seconds
      </p>
      <p className="mb-2">
        <strong>Difficulty:</strong>{" "}
        {["Easy", "Medium", "Hard"][quiz.difficulty - 1]}
      </p>

      <hr className="my-4" />

      <h3 className="text-xl font-semibold mb-2">Questions</h3>
      <ul className="space-y-4">
        {quiz.questions.map((q, idx) => (
          <li key={q.id} className="border rounded p-3">
            <p>
              <strong>Q{idx + 1}:</strong> {q.text}
            </p>
            <p>
              <strong>Type:</strong> {q.type}
            </p>
            {["SingleChoice", "MultipleChoice"].includes(q.type) && (
              <>
                <p>
                  <strong>Options:</strong>
                </p>
                <ul className="list-disc pl-6">
                  {q.options.map((opt, i) => (
                    <li key={i}>
                      {opt}{" "}
                      {q.type === "SingleChoice" &&
                        q.correctOptionIndex === i && (
                          <strong>(correct)</strong>
                        )}
                      {q.type === "MultipleChoice" &&
                        q.correctOptionIndices.includes(i) && (
                          <strong>(correct)</strong>
                        )}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {q.type === "TrueFalse" && (
              <p>
                <strong>Correct Answer:</strong>{" "}
                {q.correctAnswerBool ? "True" : "False"}
              </p>
            )}
            {q.type === "FillInTheBlank" && (
              <p>
                <strong>Correct Answer:</strong> {q.correctAnswerText}
              </p>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate(`/quiz/edit-form/${quiz.id}`)}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Edit Form Fields
      </button>
    </div>
  );
};

export default EditQuiz;
