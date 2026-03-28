namespace IdentityService.Models
{
    // Model cũ đổi tên lại cho rõ ràng (tuỳ chọn)
    public class RegisterCandidateRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string? Phone { get; set; }
        public DateOnly? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
    }

    // Model mới cho Nhà tuyển dụng
    public class RegisterRecruiterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string CompanyName { get; set; }

        // Các trường này PHẢI có dấu ? để cho phép null từ Frontend gửi lên
        public string? CompanyAddress { get; set; }
        public string? CompanyWebsite { get; set; }
        public string? CompanyDescription { get; set; }
    }
}