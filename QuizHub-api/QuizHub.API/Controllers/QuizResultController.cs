using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Feature.QuizResult.Commands;
using QuizHub.Application.Feature.QuizResult.Queries.GetResultWithAllAttempts;

namespace QuizHub.API.Controllers
{
    [Route("quiz-result")]
    [ApiController]
    [Authorize]
    public class QuizResultController : ApiControllerBase
    {
        [HttpPost("create")]
        public async Task<IActionResult> CreateQuizResultAsync([FromBody] CreateQuizResultDto dto, CancellationToken cancellationToken)
        {
            var userId = IdentityService.Username;
            var command = new CreateQuizResultCommandRequest(
                userId,
                dto.QuizId,
                dto.Answers,
                dto.TimeElapsedSeconds
            );
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        [HttpGet("details/{resultId}")]
        public async Task<IActionResult> GetResultDetaile(string resultId, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetResultWithAllAttemptsQueryRequest
            {
                ResultId = resultId
            },cancellationToken);

            return Ok(result);
        }
    }
}
