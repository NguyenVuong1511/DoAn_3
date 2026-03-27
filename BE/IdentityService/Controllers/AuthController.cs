using IdentityService.Models;
using IdentityService.Services;
using Microsoft.AspNetCore.Mvc;
using IdentityService.Repositories;

namespace IdentityService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _userRepo;
        private readonly TokenGenerator _tokenGen;

        // Khai báo trong Constructor để tự động nhận
        public AuthController(UserRepository userRepo, TokenGenerator tokenGen)
        {
            _userRepo = userRepo;
            _tokenGen = tokenGen;
        }

        [HttpPost("register/candidate")]
        public IActionResult RegisterCandidate([FromBody] RegisterRequest request)
        {
            bool isSuccess = _userRepo.RegisterCandidate(request);
            if (isSuccess)
                return Ok(new { Message = "Đăng ký ứng viên thành công!" });

            return BadRequest("Đăng ký thất bại. Email có thể đã tồn tại.");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // 1. Kiểm tra DB bằng ADO.NET
            bool isValid = _userRepo.ValidateUser(request.Email, request.Password, out string role, out Guid userId);

            if (!isValid)
                return Unauthorized(new { Message = "Sai email, mật khẩu hoặc tài khoản bị khóa!" });

            // 2. Nếu đúng, tạo Token JWT
            string tokenString = _tokenGen.GenerateToken(userId, request.Email, role);

            // 3. Trả Token về cho Client (Web/Mobile)
            return Ok(new
            {
                Message = "Đăng nhập thành công!",
                Token = tokenString,
                Role = role
            });
        }
    }
}