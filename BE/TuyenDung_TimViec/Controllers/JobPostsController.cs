using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobPostsController : ControllerBase
    {
        private readonly IJobPostRepository _jobPostRepository;

        public JobPostsController(IJobPostRepository jobPostRepository)
        {
            _jobPostRepository = jobPostRepository;
        }

        [HttpGet("top")]
        public async Task<IActionResult> GetTopJobs()
        {
            try
            {
                var jobs = await _jobPostRepository.GetTopJobPostsAsync(12);
                return Ok(RepositoryResult<object>.Ok(jobs, "Lấy danh sách top jobs thành công!"));
            }
            catch (Exception ex)
            {
                var message = ex.InnerException != null ? $"{ex.Message} | {ex.InnerException.Message}" : ex.Message;
                return StatusCode(500, $"Lỗi hệ thống: {message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetPagedJobs(
            [FromQuery] int pageNumber = 1, 
            [FromQuery] int pageSize = 10,
            [FromQuery] string title = null,
            [FromQuery] string categoryId = null,
            [FromQuery] string locationId = null,
            [FromQuery] string jobTypeId = null,
            [FromQuery] string levelId = null,
            [FromQuery] string experienceId = null,
            [FromQuery] string minSalary = null,
            [FromQuery] string maxSalary = null)
        {
            try
            {
                Guid? catId = Guid.TryParse(categoryId, out var gCat) ? gCat : null;
                Guid? locId = Guid.TryParse(locationId, out var gLoc) ? gLoc : null;
                Guid? typeId = Guid.TryParse(jobTypeId, out var gType) ? gType : null;
                Guid? lvlId = Guid.TryParse(levelId, out var gLvl) ? gLvl : null;
                Guid? expId = Guid.TryParse(experienceId, out var gExp) ? gExp : null;
                decimal? minSal = decimal.TryParse(minSalary, out var dMin) ? dMin : null;
                decimal? maxSal = decimal.TryParse(maxSalary, out var dMax) ? dMax : null;

                var (jobs, totalCount) = await _jobPostRepository.GetPagedJobPostsAsync(
                    pageNumber, 
                    pageSize, 
                    title, 
                    catId, 
                    locId, 
                    typeId, 
                    lvlId, 
                    expId, 
                    minSal, 
                    maxSal);
                var result = new
                {
                    Jobs = jobs,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                };
                return Ok(RepositoryResult<object>.Ok(result, "Lấy danh sách jobs thành công!"));
            }
            catch (Exception ex)
            {
                var message = ex.InnerException != null ? $"{ex.Message} | {ex.InnerException.Message}" : ex.Message;
                return StatusCode(500, $"Lỗi hệ thống: {message}");
            }
        }
    }
}
