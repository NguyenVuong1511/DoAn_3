namespace TuyenDung_TimViec.Models
{
    public class JobPost
    {
        public Guid? Id { get; set; }
        public Guid? RecruiterId { get; set; }
        public Guid? CompanyId { get; set; }
        public Guid? CategoryId { get; set; }
        public Guid? LocationId { get; set; }
        public Guid? JobTypeId { get; set; }
        public Guid? LevelId { get; set; }
        public Guid? ExperienceId { get; set; }

        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Requirement { get; set; }
        public string? Benefit { get; set; }
        public decimal MinSalary { get; set; }
        public decimal MaxSalary { get; set; }
        public int Quantity { get; set; }

        public DateTime? PostDate { get; set; }
        public DateTime? Deadline { get; set; }
        public string? Status { get; set; }

        // Các thuộc tính bổ sung để hiển thị lên FE
        public string? CompanyName { get; set; }
        public string? CompanyLogo { get; set; }
        public string? LocationName { get; set; }
        public string? JobTypeName { get; set; }
        public string? ExperienceName { get; set; }
        public string? LevelName { get; set; }
    }
}
