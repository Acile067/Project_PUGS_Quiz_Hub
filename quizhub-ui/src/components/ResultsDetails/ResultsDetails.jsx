import React, { useEffect, useState } from "react";
import { getResultDetails } from "../../services/resultService";
import QuestionItem from "./QuestionItem";
import ChartSection from "./ChartSection";
import TimeTaken from "./TimeTaken";

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

  return (
    <div className="pt-24 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Result Details</h1>
      <TimeTaken seconds={data.timeElapsedSeconds} />

      <h2 className="text-xl font-semibold mb-3">Questions & Answers</h2>
      <ul className="space-y-3 mb-6">
        {data.questions.map((q) => (
          <QuestionItem key={q.id} question={q} />
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-3">Progress Over Attempts</h2>
      <ChartSection attempts={data.attempts} />
    </div>
  );
};

export default ResultsDetails;
