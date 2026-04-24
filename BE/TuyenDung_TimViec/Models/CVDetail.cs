namespace TuyenDung_TimViec.Models
{
    public class CVDetail
    {
        public Guid Id { get; set; }
        public Guid CandidateId { get; set; }
        public string Title { get; set; }
        public string Type { get; set; }
        public string FileUrl { get; set; }
        public DateTime? UploadDate { get; set; }
        public bool IsDefault { get; set; }

        public List<CVEducation> Educations { get; set; } = new List<CVEducation>();
        public List<CVExperience> Experiences { get; set; } = new List<CVExperience>();
        public List<CVSkill> Skills { get; set; } = new List<CVSkill>();
    }

    public class CVEducation
    {
        public Guid Id { get; set; }
        public Guid CVId { get; set; }
        public string SchoolName { get; set; }
        public string Major { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Description { get; set; }
    }

    public class CVExperience
    {
        public Guid Id { get; set; }
        public Guid CVId { get; set; }
        public string CompanyName { get; set; }
        public string Position { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Description { get; set; }
    }

    public class CVSkill
    {
        public Guid Id { get; set; }
        public Guid CVId { get; set; }
        public string SkillName { get; set; }
        public string Level { get; set; }
    }
}
