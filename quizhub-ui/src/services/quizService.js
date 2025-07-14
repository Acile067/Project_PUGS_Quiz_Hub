const API_URL = import.meta.env.VITE_BACKEND_API_URL;

export const createQuiz = async (quizRequest) => {
  const token = localStorage.getItem("access_token");

  return await fetch(`${API_URL}/quiz/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(quizRequest),
  });
};

export const getAdminQuizzes = async () => {
  const token = localStorage.getItem("access_token");

  return await fetch(`${API_URL}/quiz/get-all-quizzes-by-created-by-id/admin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteQuiz = async (quizId) => {
  const token = localStorage.getItem("access_token");
  return await fetch(`${API_URL}/quiz/delete/${quizId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
