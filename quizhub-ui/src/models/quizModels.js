export const createQuizModel = ({
  id = "",
  title = "",
  description = "",
  category = "",
  timeLimitSeconds = 0,
  difficulty = 1,
  createdByUserId = "",
  questionCount = 0,
} = {}) => ({
  id,
  title,
  description,
  category,
  timeLimitSeconds,
  difficulty,
  createdByUserId,
  questionCount,
});
