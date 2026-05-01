using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SavedJobsController : ControllerBase
    {
        private readonly ISavedJobRepository _savedJobRepository;

        public SavedJobsController(ISavedJobRepository savedJobRepository)
        {
            _savedJobRepository = savedJobRepository;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetSavedJobs(
            Guid userId, 
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 9)
        {
            try
            {
                var (jobs, totalCount) = await _savedJobRepository.GetPagedSavedJobsAsync(userId, pageNumber, pageSize);
                var result = new
                {
                    Jobs = jobs,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };
                return Ok(RepositoryResult<object>.Ok(result, "Lấy danh sách việc làm đã lưu thành công!"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        [HttpGet("check")]
        public async Task<IActionResult> CheckSaved(Guid userId, Guid jobPostId)
        {
            try
            {
                var isSaved = await _savedJobRepository.IsJobSavedAsync(userId, jobPostId);
                return Ok(RepositoryResult<bool>.Ok(isSaved, "Kiểm tra trạng thái lưu thành công!"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        [HttpPost("toggle")]
        public async Task<IActionResult> ToggleSaved([FromQuery] Guid userId, [FromQuery] Guid jobPostId)
        {
            try
            {
                var isSaved = await _savedJobRepository.ToggleSavedJobAsync(userId, jobPostId);
                return Ok(RepositoryResult<bool>.Ok(isSaved, isSaved ? "Đã lưu việc làm!" : "Đã bỏ lưu việc làm!"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}
