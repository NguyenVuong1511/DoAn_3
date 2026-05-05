using IdentityService.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserRepository _userRepo;

        public AdminController(UserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var result = _userRepo.GetAllUsers();
            return Ok(result);
        }

        [HttpPatch("users/{userId}/status")]
        public IActionResult ToggleUserStatus(Guid userId)
        {
            var result = _userRepo.ToggleUserStatus(userId);
            if (result.Success) return Ok(result);
            return BadRequest(result);
        }
    }
}
