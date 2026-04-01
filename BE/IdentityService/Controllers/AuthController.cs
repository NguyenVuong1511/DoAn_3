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
        public IActionResult RegisterCandidate([FromBody] RegisterCandidateRequest request)
        {
            // Kết quả bây giờ là RepositoryResult<Guid> chứ không phải bool
            var result = _userRepo.RegisterCandidate(request);

            if (result.Success)
            {
                return Ok(new
                {
                    success = true,
                    message = result.Message,
                    data = new { userId = result.Data } // Trả về ID vừa tạo nếu cần
                });
            }

            // Trả về lỗi cụ thể từ Repository (Email trùng hoặc lỗi SQL...)
            return BadRequest(new
            {
                success = false,
                message = result.Message
            });
        }

        [HttpPost("register/recruiter")]
        public IActionResult RegisterRecruiter([FromBody] RegisterRecruiterRequest request)
        {
            var result = _userRepo.RegisterRecruiter(request);

            if (result.Success)
            {
                return Ok(new
                {
                    success = true,
                    message = result.Message,
                    data = new { userId = result.Data }
                });
            }

            return BadRequest(new
            {
                success = false,
                message = result.Message
            });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // 1. Kiểm tra DB bằng ADO.NET
            bool isValid = _userRepo.ValidateUser(request.Email, request.Password, out string role, out Guid userId);

            if (!isValid)
                // Trả về lỗi dùng hàm Fail() của RepositoryResult
                return Unauthorized(RepositoryResult<object>.Fail("Sai email, mật khẩu hoặc tài khoản bị khóa!"));

            // 2. Nếu đúng, tạo Token JWT
            string tokenString = _tokenGen.GenerateToken(userId, request.Email, role);

            // 3. Gom dữ liệu lại thành một object
            var responseData = new
            {
                token = tokenString,
                userId = userId,
                role = role
            };

            // 4. Trả kết quả thành công dùng hàm Ok() của RepositoryResult
            return Ok(RepositoryResult<object>.Ok(responseData, "Đăng nhập thành công!"));
        }
    }
}