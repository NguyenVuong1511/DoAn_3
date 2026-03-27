using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IdentityService.Services
{
    public class TokenGenerator
    {
        private readonly IConfiguration _config;

        // Tiêm (Inject) IConfiguration để đọc file appsettings.json
        public TokenGenerator(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateToken(Guid userId, string email, string role)
        {
            // 1. Lấy thông tin từ appsettings.json
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // 2. Khai báo các "đặc điểm nhận dạng" (Claims) của người dùng
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim("Role", role), // Role: CANDIDATE hoặc RECRUITER
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // ID duy nhất của Token
            };

            // 3. Cấu hình thời gian và ký tên lên Token
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                signingCredentials: credentials);

            // 4. Xuất ra chuỗi string mã hóa
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}