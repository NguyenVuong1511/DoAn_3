namespace IdentityService.Models
{
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        // Role sẽ được gán cứng là 'CANDIDATE' hoặc 'RECRUITER' tùy vào API họ gọi
        public string FullName { get; set; } // Bắt buộc cho bảng Candidates
    }
}
