using QuizHub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Domain.Contracts
{
    public interface IQuizRepository
    {
        Task<bool> CreateQuizAsync(Quiz quiz, CancellationToken cancellationToken);
        Task<bool> UpdateQuizAsync(Quiz quiz, CancellationToken cancellationToken);
        Task<bool> DeleteQuizAsync(string quizId, CancellationToken cancellationToken);
        Task<Quiz?> GetQuizByIdAsync(string quizId, CancellationToken cancellationToken);
    }
}
