using MediatR;
using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Commands
{
    public class CreateQuizResultCommandHandler : IRequestHandler<CreateQuizResultCommandRequest, CreateQuizResultCommandResponse>
    {
        private readonly IQuizRepository _quizRepository;
        private readonly IQuizResultRepository _quizResultRepository;
        private readonly IQuestionRepository _questionRepository;

        public CreateQuizResultCommandHandler(
            IQuizRepository quizRepository,
            IQuizResultRepository quizResultRepository,
            IQuestionRepository questionRepository)
        {
            _quizRepository = quizRepository ?? throw new ArgumentNullException(nameof(quizRepository));
            _quizResultRepository = quizResultRepository ?? throw new ArgumentNullException(nameof(quizResultRepository));
            _questionRepository = questionRepository ?? throw new ArgumentNullException(nameof(questionRepository));
        }
        public async Task<CreateQuizResultCommandResponse> Handle(CreateQuizResultCommandRequest request, CancellationToken cancellationToken)
        {
            var questions = await _questionRepository.GetQuestionsByQuizIdAsync(request.QuizId, cancellationToken);
            var questionDict = questions.ToDictionary(q => q.Id, q => q);

            int correctCount = 0;
            var userAnswers = new List<Domain.Entities.UserAnswer>();

            foreach (var answerDto in request.Answers)
            {
                if (!questionDict.TryGetValue(answerDto.QuestionId, out var question))
                    continue;

                object? parsedAnswer = null;

                if (answerDto.Answer is JsonElement je)
                {
                    parsedAnswer = question switch
                    {
                        SingleChoiceQuestion => je.ValueKind == JsonValueKind.Number ? je.GetInt32() : null,
                        MultipleChoiceQuestion => je.ValueKind == JsonValueKind.Array ? je.Deserialize<List<int>>() : null,
                        TrueFalseQuestion => je.ValueKind == JsonValueKind.True || je.ValueKind == JsonValueKind.False ? je.GetBoolean() : null,
                        FillInTheBlankQuestion => je.ValueKind == JsonValueKind.String ? je.GetString() : null,
                        _ => null
                    };
                }

                var isCorrect = question.IsCorrect(parsedAnswer!);

                if (isCorrect) correctCount++;

                userAnswers.Add(new Domain.Entities.UserAnswer
                {
                    Id = Guid.NewGuid().ToString(),
                    QuestionId = answerDto.QuestionId,
                    IsCorrect = isCorrect,
                    Answer = parsedAnswer
                });
            }

            var result = new Domain.Entities.QuizResult
            {
                Id = Guid.NewGuid().ToString(),
                QuizId = request.QuizId,
                UserId = request.UserId,
                TotalQuestions = questions.Count(),
                CorrectAnswers = correctCount,
                Score = Math.Round((double)correctCount / questions.Count() * 100, 2),
                CompletedAt = DateTime.UtcNow,
                Answers = userAnswers
            };

            var saved = await _quizResultRepository.AddAsync(result, cancellationToken);

            return new CreateQuizResultCommandResponse
            {
                IsSuccess = saved,
                Message = saved ? "Quiz result saved successfully." : "Failed to save result."
            };
        }
    }
}
