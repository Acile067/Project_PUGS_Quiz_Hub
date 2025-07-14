const API_URL = import.meta.env.VITE_BACKEND_API_URL;

export const createQuestion = async (questionRequest) => {
  const token = localStorage.getItem("access_token");

  return await fetch(`${API_URL}/question/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(questionRequest),
  });
};
