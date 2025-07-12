using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizHub.API.Service;
using QuizHub.Application.Feature.Token.Command;
using QuizHub.Application.Feature.User.Commands.CreateUser;
using QuizHub.Application.Feature.User.Quieries.GetUserProfilePicture;

namespace QuizHub.API.Controllers
{
    [Route("users")]
    [ApiController]
    [Authorize]
    public class UserController : ApiControllerBase
    {
        [HttpPost]
        [Route("create")]
        [AllowAnonymous] 
        public async Task<IActionResult> CreateUser([FromForm] CreateUserRequest command, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] CreateTokenRequest command, CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(command, cancellationToken);
            return Ok(result);
        }
        [HttpGet]
        [Route("profilepicture")]
        public async Task<IActionResult> GetUserProfilePicture(CancellationToken cancellationToken)
        {
            var result = await Mediator.Send(new GetUserProfilePictureRequest() { Username = IdentityService.Username }, cancellationToken);
            return Ok(result);
        }

    }
}
