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
            int loginStatus = _userRepo.ValidateUser(request.Email, request.Password, out string role, out Guid userId);

            if (loginStatus == 0)
                return Unauthorized(RepositoryResult<object>.Fail("Sai email hoặc mật khẩu!"));
            
            if (loginStatus == -1)
                return Unauthorized(RepositoryResult<object>.Fail("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ."));

            // 2. Nếu đúng (loginStatus == 1), tạo Token JWT
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
        // 4. Lấy thông tin tài khoản
        [HttpGet("account/{userId}")]
        public IActionResult GetAccountInfo(Guid userId)
        {
            var result = _userRepo.GetAccountInfo(userId);
            if (result.Success) return Ok(result);
            return NotFound(result);
        }

        // 5. Đổi mật khẩu
        [HttpPut("change-password")]
        public IActionResult ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var result = _userRepo.ChangePassword(request);
            if (result.Success) return Ok(result);
            return BadRequest(result);
        }

        // 6. Đổi Email
        [HttpPut("change-email")]
        public IActionResult ChangeEmail([FromBody] ChangeEmailRequest request)
        {
            var result = _userRepo.ChangeEmail(request);
            if (result.Success) return Ok(result);
            return BadRequest(result);
        }

        // 7. Cập nhật Profile Candidate
        [HttpPut("profile/candidate")]
        public IActionResult UpdateCandidateProfile([FromBody] UpdateCandidateProfileRequest request)
        {
            var result = _userRepo.UpdateCandidateProfile(request);
            if (result.Success) return Ok(result);
            return BadRequest(result);
        }

        // 8. Cập nhật Profile Recruiter
        [HttpPut("profile/recruiter")]
        public IActionResult UpdateRecruiterProfile([FromBody] UpdateRecruiterProfileRequest request)
        {
            var result = _userRepo.UpdateRecruiterProfile(request);
            if (result.Success) return Ok(result);
            return BadRequest(result);
        }
    }
}