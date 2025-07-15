using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.QuizResult.Commands
{
    public class CreateQuizResultCommandRequest : IRequest<CreateQuizResultCommandResponse>
    {
        public CreateQuizResultCommandRequest(string userId, string quizId, List<AnswerDto> answers, int timeElapsedSeconds)
        {
            UserId = userId;
            QuizId = quizId;
            Answers = answers;
            TimeElapsedSeconds = timeElapsedSeconds;
        }
        public string QuizId { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public int TimeElapsedSeconds { get; set; }

        public List<AnswerDto> Answers { get; set; } = new();
    }
    public class AnswerDto
    {
        public string QuestionId { get; set; } = string.Empty;
        public object? Answer { get; set; }
    }
    public class CreateQuizResultDto
    {
        public string QuizId { get; set; } = string.Empty;
        public List<AnswerDto> Answers { get; set; } = new();
        public int TimeElapsedSeconds { get; set; }
    }

    public class CreateQuizResultCommandResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
