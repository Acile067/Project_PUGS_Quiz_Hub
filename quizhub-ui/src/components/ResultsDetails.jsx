import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getResultDetails } from "../services/resultService";

const formatAnswer = (answer, question) => {
  if (answer === undefined || answer === null) return "Not answered";

  switch (question.type) {
    case "SingleChoice": {
      const index = answer - 1;
      if (
        typeof index !== "number" ||
        !question.options ||
        index < 0 ||
        index >= question.options.length
      ) {
        return `[invalid index: ${answer}]`;
      }
      return question.options[index];
    }

    case "MultipleChoice":
      if (!Array.isArray(answer)) return "[invalid format]";
      return answer
        .map((i) => {
          const index = i - 1;
          return question.options &&
            index >= 0 &&
            index < question.options.length
            ? question.options[index]
            : `[?${i}]`;
        })
        .join(", ");

    case "TrueFalse":
      return answer === true || answer === "true" ? "True" : "False";

    case "FillInTheBlank":
      return String(answer);

    default:
      return String(answer);
  }
};

const ResultsDetails = ({ resultId }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const resultData = await getResultDetails(resultId);
        setData(resultData);
      } catch (err) {
        setError(err.message || "Failed to load result");
      }
    };

    fetchResult();
  }, [resultId]);

  if (error) return <p className="pt-24 text-red-600">{error}</p>;
  if (!data) return <p className="pt-24">Loading...</p>;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="pt-24 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Result Details</h1>

      <p className="mb-4">
        <strong>Time taken:</strong> {formatTime(data.timeElapsedSeconds)}
      </p>

      <h2 className="text-xl font-semibold mb-3">Questions & Answers</h2>
      <ul className="space-y-2 mb-6">
        {data.questions.map((q) => (
          <li key={q.id} className="border p-3 rounded-md">
            <p className="font-medium mb-1">{q.text}</p>

            {q.options && (
              <div className="mb-2 ml-4">
                <p className="text-sm font-semibold mb-1">Options:</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {q.options.map((opt, idx) => (
                    <li key={idx}>
                      <strong>{idx + 1}.</strong> {opt}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p>
              <strong>Your answer:</strong>{" "}
              <span className={q.isCorrect ? "text-green-600" : "text-red-600"}>
                {formatAnswer(q.userAnswer, q)}
              </span>
            </p>

            {!q.isCorrect && (
              <p className="text-blue-600">
                <strong>Correct answer:</strong>{" "}
                {formatAnswer(q.correctAnswer, q)}
              </p>
            )}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-3">Progress Over Attempts</h2>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.attempts}>
            <CartesianGrid stroke="#ccc" />
            <XAxis
              dataKey="time"
              label={{
                value: "Time (s)",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Correct Answers",
                angle: -90,
                position: "insideLeft",
              }}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="correctAnswers" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultsDetails;
