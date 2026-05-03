using System;
using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Models;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobApplicationsController : ControllerBase
    {
        private readonly IJobApplicationRepository _applicationRepo;

        public JobApplicationsController(IJobApplicationRepository applicationRepo)
        {
            _applicationRepo = applicationRepo;
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyJob([FromBody] JobApplication application)
        {
            if (application == null) return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ." });

            try
            {
                // In the repo, we handle UserId -> CandidateId mapping if needed
                bool result = await _applicationRepo.ApplyJobAsync(application);
                if (result)
                {
                    return Ok(new { success = true, message = "Nộp đơn ứng tuyển thành công!" });
                }
                return BadRequest(new { success = false, message = "Nộp đơn thất bại." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpGet("my-applications/{userId}")]
        public async Task<IActionResult> GetMyApplications(Guid userId)
        {
            try
            {
                var applications = await _applicationRepo.GetApplicationsByCandidateIdAsync(userId);
                return Ok(new { success = true, data = applications });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy danh sách đơn ứng tuyển: " + ex.Message });
            }
        }

        [HttpGet("job/{jobPostId}")]
        public async Task<IActionResult> GetApplicationsByJob(Guid jobPostId)
        {
            try
            {
                var applications = await _applicationRepo.GetApplicationsByJobPostIdAsync(jobPostId);
                return Ok(new { success = true, data = applications });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy danh sách ứng viên: " + ex.Message });
            }
        }

        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request)
        {
            try
            {
                bool result = await _applicationRepo.UpdateApplicationStatusAsync(id, request.Status, request.Note);
                if (result)
                {
                    return Ok(new { success = true, message = "Cập nhật trạng thái thành công." });
                }
                return NotFound(new { success = false, message = "Không tìm thấy đơn ứng tuyển." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi cập nhật trạng thái: " + ex.Message });
            }
        }

        [HttpGet("check/{userId}/{jobPostId}")]
        public async Task<IActionResult> CheckIfApplied(Guid userId, Guid jobPostId)
        {
            try
            {
                bool applied = await _applicationRepo.CheckIfAppliedAsync(userId, jobPostId);
                return Ok(new { success = true, applied });
            }
            catch (Exception ex) {
                return StatusCode(500, new { success = false, message = "Lỗi khi kiểm tra trạng thái: " + ex.Message });
            }
        }

        [HttpDelete("withdraw/{id}")]
        public async Task<IActionResult> WithdrawApplication(Guid id)
        {
            try
            {
                bool result = await _applicationRepo.WithdrawApplicationAsync(id);
                if (result)
                {
                    return Ok(new { success = true, message = "Rút hồ sơ thành công." });
                }
                return BadRequest(new { success = false, message = "Không thể rút hồ sơ. Có thể hồ sơ đã được xử lý hoặc không tồn tại." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi rút hồ sơ: " + ex.Message });
            }
        }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
    }
}
