using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Repositories;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IJobPostRepository _jobRepo;
        private readonly ICompanyRepository _companyRepo;

        public AdminController(IJobPostRepository jobRepo, ICompanyRepository companyRepo)
        {
            _jobRepo = jobRepo;
            _companyRepo = companyRepo;
        }

        [HttpGet("dashboard/stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _jobRepo.GetStatsAsync();
            return Ok(RepositoryResult<object>.Ok(stats, "Lấy thống kê thành công!"));
        }

        [HttpGet("companies")]
        public async Task<IActionResult> GetAllCompanies()
        {
            var companies = await _companyRepo.GetAllAsync();
            return Ok(RepositoryResult<object>.Ok(companies, "Lấy danh sách công ty thành công!"));
        }

        [HttpPatch("companies/{id}/verify")]
        public async Task<IActionResult> ToggleCompanyVerify(Guid id)
        {
            var result = await _companyRepo.ToggleVerifyAsync(id);
            if (result) return Ok(RepositoryResult<object>.Ok(null, "Cập nhật trạng thái xác minh thành công!"));
            return BadRequest(RepositoryResult<object>.Fail("Không thể cập nhật trạng thái xác minh."));
        }
        
        [HttpGet("jobs")]
        public async Task<IActionResult> GetAllJobs([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 100)
        {
            var (jobs, totalCount) = await _jobRepo.GetPagedJobPostsAsync(pageNumber, pageSize);
            var result = new
            {
                Jobs = jobs,
                TotalCount = totalCount
            };
            return Ok(RepositoryResult<object>.Ok(result, "Lấy danh sách việc làm thành công!"));
        }

        [HttpPatch("jobs/{id}/status")]
        public async Task<IActionResult> ToggleJobStatus(Guid id)
        {
            var result = await _jobRepo.ToggleJobPostStatusAsync(id);
            if (result) return Ok(RepositoryResult<object>.Ok(null, "Cập nhật trạng thái việc làm thành công!"));
            return BadRequest(RepositoryResult<object>.Fail("Không thể cập nhật trạng thái việc làm."));
        }
    }
}
