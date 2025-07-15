import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createQuizWithQuestionsModel } from "../models/quizModels";
import {
  getQuizByIdWithQuestions,
  submitQuizResult,
} from "../services/quizService";
import { getUserIdFromToken } from "../services/authService";

const StartQuiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getQuizByIdWithQuestions(id);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to load quiz.");
        const parsed = createQuizWithQuestionsModel(data);
        setQuiz(parsed);
        setTimeLeft(parsed.timeLimitSeconds);
        setStartTime(Date.now());
      } catch (err) {
        setError(err.message);
      }
    };
    fetchQuiz();
  }, [id]);

  // Timer countdown
  useEffect(() => {
    if (!timeLeft || submitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(); // auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, submitted]);

  const handleChange = (questionId, index) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  const handleMultiChange = (questionId, index) => {
    setUserAnswers((prev) => {
      const selected = new Set(prev[questionId] || []);
      if (selected.has(index)) {
        selected.delete(index);
      } else {
        selected.add(index);
      }
      return { ...prev, [questionId]: Array.from(selected) };
    });
  };

  const formatAnswer = (answer, question, isCorrectAnswer = false) => {
    if (answer === undefined || answer === null) {
      return isCorrectAnswer ? "Correct Answer" : "Not answered";
    }

    if (question.type === "MultipleChoice" && Array.isArray(answer)) {
      return answer
        .map((i) => question.options[i - 1] ?? `[invalid index ${i}]`)
        .join(", ");
    }

    if (question.type === "SingleChoice" && typeof answer === "number") {
      return question.options[answer - 1] ?? `[invalid index ${answer}]`;
    }

    if (question.type === "TrueFalse") {
      return answer === true || answer === "true"
        ? "True"
        : answer === false || answer === "false"
        ? "False"
        : "Invalid";
    }

    return String(answer);
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const now = Date.now();
    const timeElapsedSeconds = startTime
      ? Math.floor((now - startTime) / 1000)
      : null;

    const normalizedAnswers = {};

    for (const [questionId, answer] of Object.entries(userAnswers)) {
      const question = quiz.questions.find((q) => q.id === questionId);
      if (!question) continue;

      if (question.type === "SingleChoice") {
        normalizedAnswers[questionId] = answer + 1;
      } else if (question.type === "MultipleChoice") {
        normalizedAnswers[questionId] = answer.map((index) => index + 1);
      } else {
        normalizedAnswers[questionId] = answer;
      }
    }

    console.log("Submitted normalized answers:", normalizedAnswers);

    try {
      const userId = getUserIdFromToken();
      const result = await submitQuizResult(
        quiz.id,
        userId,
        timeElapsedSeconds,
        normalizedAnswers
      );
      setResult(result);

      console.log("Quiz result response:", result);
    } catch (err) {
      console.error("Error submitting quiz result:", err.message);
      setError(err.message);
    }
  };

  if (error)
    return <div className="text-red-600 text-center mt-24">{error}</div>;
  if (!quiz) return <div className="text-center mt-24">Loading quiz...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-24 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
      <p className="mb-4 text-gray-600">{quiz.description}</p>

      <div className="text-right mb-4 font-semibold text-red-600">
        Time left: {timeLeft}s
      </div>

      {quiz.questions.map((q) => (
        <div key={q.id} className="mb-6">
          <p className="font-semibold">{q.text}</p>
          {q.type === "TrueFalse" && (
            <div className="flex gap-4 mt-2">
              <label>
                <input
                  type="radio"
                  name={q.id}
                  value="true"
                  disabled={submitted}
                  checked={userAnswers[q.id] === true}
                  onChange={() => handleChange(q.id, true)}
                />
                True
              </label>
              <label>
                <input
                  type="radio"
                  name={q.id}
                  value="false"
                  disabled={submitted}
                  checked={userAnswers[q.id] === false}
                  onChange={() => handleChange(q.id, false)}
                />
                False
              </label>
            </div>
          )}

          {q.type === "FillInTheBlank" && (
            <input
              type="text"
              disabled={submitted}
              className="border mt-2 px-2 py-1 rounded w-full"
              value={userAnswers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}

          {q.type === "SingleChoice" && (
            <div className="mt-2 space-y-1">
              {q.options.map((option, i) => (
                <label key={i} className="block">
                  <input
                    type="radio"
                    name={`single-${q.id}`}
                    value={i}
                    disabled={submitted}
                    checked={userAnswers[q.id] === i}
                    onChange={() => handleChange(q.id, i)}
                  />{" "}
                  {option}
                </label>
              ))}
            </div>
          )}

          {q.type === "MultipleChoice" && (
            <div className="mt-2 space-y-1">
              {q.options.map((option, i) => (
                <label key={i} className="block">
                  <input
                    type="checkbox"
                    value={i}
                    disabled={submitted}
                    checked={(userAnswers[q.id] || []).includes(i)}
                    onChange={() => handleMultiChange(q.id, i)}
                  />{" "}
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Answers
        </button>
      ) : (
        <div className="mt-6 text-green-600 font-bold text-center">
          Answers submitted!
        </div>
      )}
      {result && (
        <div className="mt-6 text-center">
          <p className="text-xl font-bold">Results:</p>
          <p>
            Correct Answers: {result.correctAnswers} / {result.totalQuestions}
          </p>
          <p>Score: {result.score}%</p>

          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Details:</h3>
            {quiz.questions.map((q) => {
              const userAnswer = result.answers.find(
                (a) => a.questionId === q.id
              );
              const isCorrect = userAnswer?.isCorrect;

              return (
                <div
                  key={q.id}
                  className={`p-3 border rounded mb-2 ${
                    isCorrect ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <p className="font-semibold">{q.text}</p>
                  <p>
                    <strong>Your Answer:</strong>{" "}
                    {formatAnswer(userAnswer?.answer, q, false)}
                  </p>
                  <p>
                    <strong>Correct Answer:</strong>{" "}
                    {formatAnswer(userAnswer?.correctAnswer, q, true)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartQuiz;
