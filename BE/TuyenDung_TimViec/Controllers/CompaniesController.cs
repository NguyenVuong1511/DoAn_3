using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepository;

        public CompaniesController(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCompanies([FromQuery] int? top)
        {
            try
            {
                var companies = await _companyRepository.GetAllAsync(top);
                return Ok(RepositoryResult<object>.Ok(companies, "Lấy danh sách thành công!"));
            }
            catch (Exception ex)
            {
                var message = ex.InnerException != null ? $"{ex.Message} | {ex.InnerException.Message}" : ex.Message;
                return StatusCode(500, $"Lỗi hệ thống: {message}");
            }
        }
    }
}