using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.Application.Feature.User.Commands.CreateUser;

namespace QuizHub.API.Controllers
{
    [Route("users")]
    [ApiController]
    public class UserController : ApiControllerBase
    {
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> CreateUser([FromForm] CreateUserRequest command, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
    }
}
