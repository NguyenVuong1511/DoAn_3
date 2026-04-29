using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        private readonly ILocationRepository _locationRepository;

        public LocationsController(ILocationRepository locationRepository)
        {
            _locationRepository = locationRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var locations = await _locationRepository.GetAllAsync();
                return Ok(RepositoryResult<object>.Ok(locations, "Lấy danh sách địa điểm thành công!"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}
