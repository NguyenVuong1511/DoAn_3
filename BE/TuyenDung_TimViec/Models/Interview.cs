using System;

namespace TuyenDung_TimViec.Models
{
    public class Interview
    {
        public Guid Id { get; set; }
        public Guid ApplicationId { get; set; }
        public DateTime InterviewDate { get; set; }
        public string? Location { get; set; }
        public string? Notes { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties for UI convenience
        public string? JobTitle { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }
        public string? CandidateName { get; set; }
    }
}
