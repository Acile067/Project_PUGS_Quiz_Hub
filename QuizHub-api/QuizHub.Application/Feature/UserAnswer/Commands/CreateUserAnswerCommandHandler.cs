using MediatR;
using QuizHub.Domain.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.UserAnswer.Commands
{
    public class CreateUserAnswerCommandHandler : IRequestHandler<CreateUserAnswerCommandRequest, CreateUserAnswerCommandResponse>
    {
        private readonly IUserAnswerRepository _userAnswerRepository;
        public CreateUserAnswerCommandHandler(IUserAnswerRepository userAnswerRepository)
        {
            _userAnswerRepository = userAnswerRepository ?? throw new ArgumentNullException(nameof(userAnswerRepository));
        }
        public async Task<CreateUserAnswerCommandResponse> Handle(CreateUserAnswerCommandRequest request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException("This method is not implemented yet. Please implement the logic to handle the creation of user answers.");

        }
    }
}
