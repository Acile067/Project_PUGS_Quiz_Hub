using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Application.Feature.Quiz.Commands.CreateQuiz
{
    public class CreateQuizCommandValidator : AbstractValidator<CreateQuizCommandRequest>
    {
        public CreateQuizCommandValidator() 
        { 
            
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(100).WithMessage("Title must not exceed 100 characters.");
            RuleFor(x => x.Category)
                .NotEmpty().WithMessage("Category is required.");
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MaximumLength(500).WithMessage("Description must not exceed 500 characters.");
            RuleFor(x => x.TimeLimitSeconds)
                .GreaterThan(0).WithMessage("Time limit must be greater than zero.");
            RuleFor(x => x.Difficulty)
            .InclusiveBetween(1, 3).WithMessage("Difficulty must be between 1 and 3.");
        }
    }
}
