import React from "react";
import formatAnswer from "./formatAnswer";

const QuestionItem = ({ question }) => {
  return (
    <li className="border p-3 rounded-md">
      <p className="font-medium mb-2">{question.text}</p>

      {question.options && (
        <div className="mb-2 ml-4">
          <p className="text-sm font-semibold mb-1">Options:</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
            {question.options.map((opt, idx) => (
              <li key={idx}>
                <strong>{idx + 1}.</strong> {opt}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p>
        <strong>Your answer:</strong>{" "}
        <span
          className={question.isCorrect ? "text-green-600" : "text-red-600"}
        >
          {formatAnswer(question.userAnswer, question)}
        </span>
      </p>

      {!question.isCorrect && (
        <p className="text-blue-600">
          <strong>Correct answer:</strong>{" "}
          {formatAnswer(question.correctAnswer, question)}
        </p>
      )}
    </li>
  );
};

export default QuestionItem;
