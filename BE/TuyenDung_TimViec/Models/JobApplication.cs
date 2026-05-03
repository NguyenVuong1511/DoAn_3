using System;
using System.Text.Json.Serialization;

namespace TuyenDung_TimViec.Models
{
    public class JobApplication
    {
        public Guid Id { get; set; }
        public Guid CandidateId { get; set; }
        public Guid JobPostId { get; set; }
        public Guid CVId { get; set; }
        public DateTime ApplyDate { get; set; }
        public string? CoverLetter { get; set; }
        public string Status { get; set; } = "Pending";
        
        [JsonPropertyName("cvType")]
        public string? CVType { get; set; } = "Online";
        
        public string? EmployerNote { get; set; }

        // Navigation properties for UI convenience
        public string? JobTitle { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }
        public string? CVTitle { get; set; }
        public string? CandidateName { get; set; }
        public string? CandidateAvatar { get; set; }
        public string? CVFileUrl { get; set; }
        public Guid? CandidateUserId { get; set; }
    }
}
