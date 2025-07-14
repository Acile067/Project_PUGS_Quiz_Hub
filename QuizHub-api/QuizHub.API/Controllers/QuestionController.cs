using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Feature.Question.Commands.CreateQuestion;

namespace QuizHub.API.Controllers
{
    [Route("question")]
    [ApiController]
    [Authorize]
    public class QuestionController : ApiControllerBase
    {
        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreayeQuestionAsync([FromBody] CreateQuestionCommandRequest commandRequest, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(commandRequest, cancellationToken);
            return Ok(result);
        }

    }
}
