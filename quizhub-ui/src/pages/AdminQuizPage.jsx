import React from "react";
import CreateQuiz from "../components/CreateQuiz";
import AdminQuizList from "../components/AdminQuizList";

const AdminQuizPage = () => {
  return (
    <>
      <CreateQuiz />
      <AdminQuizList />
    </>
  );
};

export default AdminQuizPage;
