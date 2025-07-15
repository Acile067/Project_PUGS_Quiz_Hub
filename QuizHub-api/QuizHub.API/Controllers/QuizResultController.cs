using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Feature.QuizResult.Commands;

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
    }
}
