using System;
using Microsoft.AspNetCore.Mvc;
using TuyenDung_TimViec.Models;
using TuyenDung_TimViec.Repositories;

namespace TuyenDung_TimViec.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterviewsController : ControllerBase
    {
        private readonly IInterviewRepository _interviewRepo;

        public InterviewsController(IInterviewRepository interviewRepo)
        {
            _interviewRepo = interviewRepo;
        }

        [HttpPost("schedule")]
        public async Task<IActionResult> ScheduleInterview([FromBody] Interview interview)
        {
            try
            {
                bool result = await _interviewRepo.ScheduleInterviewAsync(interview);
                if (result)
                {
                    return Ok(new { success = true, message = "Hẹn lịch phỏng vấn thành công!" });
                }
                return BadRequest(new { success = false, message = "Không thể hẹn lịch phỏng vấn." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi hệ thống: " + ex.Message });
            }
        }

        [HttpGet("candidate/{userId}")]
        public async Task<IActionResult> GetCandidateInterviews(Guid userId)
        {
            try
            {
                var interviews = await _interviewRepo.GetInterviewsByCandidateIdAsync(userId);
                return Ok(new { success = true, data = interviews });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy danh sách lịch phỏng vấn: " + ex.Message });
            }
        }

        [HttpGet("application/{applicationId}")]
        public async Task<IActionResult> GetApplicationInterviews(Guid applicationId)
        {
            try
            {
                var interviews = await _interviewRepo.GetInterviewsByApplicationIdAsync(applicationId);
                return Ok(new { success = true, data = interviews });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lấy thông tin phỏng vấn: " + ex.Message });
            }
        }

        [HttpPut("status/{id}")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] string status)
        {
            try
            {
                bool result = await _interviewRepo.UpdateInterviewStatusAsync(id, status);
                if (result)
                {
                    return Ok(new { success = true, message = "Cập nhật trạng thái phỏng vấn thành công." });
                }
                return NotFound(new { success = false, message = "Không tìm thấy lịch phỏng vấn." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi cập nhật trạng thái: " + ex.Message });
            }
        }
    }
}
