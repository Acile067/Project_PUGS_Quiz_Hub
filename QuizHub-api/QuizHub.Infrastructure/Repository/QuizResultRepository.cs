using QuizHub.Domain.Contracts;
using QuizHub.Domain.Entities;
using QuizHub.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QuizHub.Infrastructure.Repository
{
    public class QuizResultRepository : IQuizResultRepository
    {
        private readonly AppDbContext _context;
        public QuizResultRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }
        public async Task<bool> AddAsync(QuizResult quizResult, CancellationToken cancellationToken)
        {
            await _context.QuizResults.AddAsync(quizResult, cancellationToken);
            return await _context.SaveChangesAsync(cancellationToken) > 0;
        }
    }
}
