import React from "react";

const TimeTaken = ({ seconds }) => {
  const formatTime = (s) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <p className="mb-4">
      <strong>Time taken:</strong> {formatTime(seconds)}
    </p>
  );
};

export default TimeTaken;
