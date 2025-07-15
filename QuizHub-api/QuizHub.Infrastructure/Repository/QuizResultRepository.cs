using Microsoft.EntityFrameworkCore;
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

        public async Task<List<QuizResult>> GetResultsByUserIdAsync(string userId, CancellationToken cancellationToken)
        {
            return await _context.QuizResults
                .Where(r => r.UserId == userId)
                .Include(r => r.Quiz)
                .ToListAsync(cancellationToken);
        }
    }
}
