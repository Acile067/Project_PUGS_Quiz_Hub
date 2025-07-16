import React from "react";

const UserHero = () => {
  return (
    <div className="max-w-xl mx-auto text-center px-4 py-10">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
        Welcome back, <span className="text-indigo-600">Quizzer!</span>
      </h1>
      <p className="text-lg text-gray-700 tracking-wide">
        Continue where you left off or explore new quizzes to sharpen your
        skills and have fun.
      </p>
    </div>
  );
};

export default UserHero;
