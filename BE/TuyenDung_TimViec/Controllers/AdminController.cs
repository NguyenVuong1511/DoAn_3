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
        private readonly ICategoryRepository _categoryRepo;
        private readonly ILocationRepository _locationRepo;

        public AdminController(IJobPostRepository jobRepo, ICompanyRepository companyRepo, ICategoryRepository categoryRepo, ILocationRepository locationRepo)
        {
            _jobRepo = jobRepo;
            _companyRepo = companyRepo;
            _categoryRepo = categoryRepo;
            _locationRepo = locationRepo;
        }

        // ─── CATEGORIES ─────────────────────────────────────────────────────────────

        [HttpGet("categories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryRepo.GetAllAsync();
            return Ok(RepositoryResult<object>.Ok(categories, "Lấy danh sách danh mục thành công!"));
        }

        [HttpPost("categories")]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            var result = await _categoryRepo.AddAsync(category);
            if (result) return Ok(RepositoryResult<object>.Ok(null, "Thêm danh mục thành công!"));
            return BadRequest(RepositoryResult<object>.Fail("Không thể thêm danh mục."));
        }

        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] Category category)
        {
            category.Id = id;
            var result = await _categoryRepo.UpdateAsync(category);
            if (result) return Ok(RepositoryResult<object>.Ok(null, "Cập nhật danh mục thành công!"));
            return BadRequest(RepositoryResult<object>.Fail("Không thể cập nhật danh mục."));
        }

        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var result = await _categoryRepo.DeleteAsync(id);
            if (result) return Ok(RepositoryResult<object>.Ok(null, "Xóa danh mục thành công!"));
            return BadRequest(RepositoryResult<object>.Fail("Không thể xóa danh mục."));
        }

        // ─── LOCATIONS ──────────────────────────────────────────────────────────────

        [HttpGet("locations")]
        public async Task<IActionResult> GetAllLocations()
        {
            var locations = await _locationRepo.GetAllAsync();
            return Ok(RepositoryResult<object>.Ok(locations, "Lấy danh sách địa điểm thành công!"));
        }

        [HttpPost("locations")]
        public async Task<IActionResult> AddLocation([FromBody] Location location)
        {
            var result = await _locationRepo.AddAsync(location);
            if (result) return Ok(RepositoryResult<object>.Ok(null, "Thêm địa điểm thành công!"));
            return BadRequest(RepositoryResult<object>.Fail("Không thể thêm địa điểm."));
        }

        [HttpPut("locations/{id}")]
        public async Task<IActionResult> UpdateLocation(Guid id, [FromBody] Location location)
        {
            location.Id = id;
            var result = await _locationRepo.UpdateAsync(location);
            if (result) return Ok(RepositoryResult<object>.Ok(null, "Cập nhật địa điểm thành công!"));
            return BadRequest(RepositoryResult<object>.Fail("Không thể cập nhật địa điểm."));
        }

        [HttpDelete("locations/{id}")]
        public async Task<IActionResult> DeleteLocation(Guid id)
        {
            var result = await _locationRepo.DeleteAsync(id);
            if (result) return Ok(RepositoryResult<object>.Ok(null, "Xóa địa điểm thành công!"));
            return BadRequest(RepositoryResult<object>.Fail("Không thể xóa địa điểm."));
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
        public async Task<IActionResult> UpdateJobStatus(Guid id, [FromQuery] string action)
        {
            // Nếu không có action, mặc định là toggle (nhưng ta nên khuyến khích dùng action)
            // Ở đây ta sử dụng logic: nếu action là 'approve' thì set Active, ngược lại (hoặc 'reject') thì set Rejected
            var result = await _jobRepo.AdminUpdateJobStatusAsync(id, action ?? "approve");
            if (result) return Ok(RepositoryResult<object>.Ok(null, "Cập nhật trạng thái việc làm thành công!"));
            return BadRequest(RepositoryResult<object>.Fail("Không thể cập nhật trạng thái việc làm."));
        }
    }
}
