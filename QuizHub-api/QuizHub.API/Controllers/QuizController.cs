using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Feature.Quiz.Commands.CreateQuiz;

namespace QuizHub.API.Controllers
{
    [Route("quiz")]
    [ApiController]
    [Authorize]
    public class QuizController : ApiControllerBase
    {
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateQuizAsync([FromBody] CreateQuizDto dto, CancellationToken cancellationToken)
        {
            var userId = IdentityService.Username;

            var command = new CreateQuizCommandRequest(
                userId,
                dto.Title,
                dto.Description,
                dto.TimeLimitSeconds,
                dto.Difficulty
            );

            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
    }
}
