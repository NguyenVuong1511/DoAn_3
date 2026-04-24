using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CVsController : ControllerBase
    {
        private readonly ICVRepository _cvRepository;

        public CVsController(ICVRepository cvRepository)
        {
            _cvRepository = cvRepository;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetCVDetailByUserId(Guid userId)
        {
            try
            {
                var cv = await _cvRepository.GetCVDetailByUserIdAsync(userId);
                if (cv == null)
                {
                    return NotFound(RepositoryResult<object>.Fail("Không tìm thấy CV cho ứng viên này."));
                }
                return Ok(RepositoryResult<object>.Ok(cv, "Lấy thông tin CV thành công!"));
            }
            catch (Exception ex)
            {
                var message = ex.InnerException != null ? $"{ex.Message} | {ex.InnerException.Message}" : ex.Message;
                return StatusCode(500, $"Lỗi hệ thống: {message}");
            }
        }
    }
}
