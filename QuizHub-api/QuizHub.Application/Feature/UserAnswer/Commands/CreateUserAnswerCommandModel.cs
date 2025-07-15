using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.UserAnswer.Commands
{
    public class CreateUserAnswerCommandRequest : IRequest<CreateUserAnswerCommandResponse>
    {
    }
    public class CreateUserAnswerCommandResponse
    {
        public bool IsSuccess { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
