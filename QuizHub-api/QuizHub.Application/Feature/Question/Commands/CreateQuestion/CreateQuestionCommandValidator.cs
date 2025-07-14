using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Question.Commands.CreateQuestion
{
    public class CreateQuestionCommandValidator : AbstractValidator<CreateQuestionCommandRequest>
    {
        public CreateQuestionCommandValidator() 
        { 
            
            RuleFor(x => x.QuizId)
                .NotEmpty().WithMessage("Quiz ID is required.")
                .NotNull().WithMessage("Quiz ID cannot be null.");
            RuleFor(x => x.Text)
                .NotEmpty().WithMessage("Question text is required.")
                .NotNull().WithMessage("Question text cannot be null.")
                .MaximumLength(500).WithMessage("Question text cannot exceed 500 characters.");

        }
    }
}
