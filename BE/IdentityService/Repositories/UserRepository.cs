using IdentityService.Models;
using Microsoft.Data.SqlClient;

namespace IdentityService.Repositories 
{
    public class UserRepository
    {
        private readonly string _connectionString;

        // Tiêm IConfiguration vào để tự động đọc appsettings.json
        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // 1. Hàm Đăng Nhập
        public bool ValidateUser(string email, string password, out string role, out Guid userId)
        {
            bool isValid = false;
            role = "";
            userId = Guid.Empty;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // Chỉ cho phép user có Status là ACTIVE đăng nhập
                string query = "SELECT Id, Role FROM Users WHERE Email = @email AND Password = @password AND Status = 'ACTIVE'";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@email", email);
                cmd.Parameters.AddWithValue("@password", password); // Sẽ thay bằng Hash sau

                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        isValid = true;
                        userId = reader.GetGuid(0);
                        role = reader.GetString(1); // Lấy role (CANDIDATE/RECRUITER/ADMIN)
                    }
                }
            }
            return isValid;
        }

        // 2. Hàm Đăng Ký Ứng Viên (Candidate)
        public bool RegisterCandidate(RegisterRequest req)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                // Dùng Transaction: Đảm bảo insert cả 2 bảng thành công, nếu lỗi thì quay xe (Rollback)
                using (SqlTransaction trans = conn.BeginTransaction())
                {
                    try
                    {
                        Guid newUserId = Guid.NewGuid();

                        // Insert bảng Users
                        string insertUser = "INSERT INTO Users (Id, Email, Password, Role, Status, CreatedAt) " +
                                            "VALUES (@id, @email, @pass, 'CANDIDATE', 'ACTIVE', GETDATE())";
                        SqlCommand cmdUser = new SqlCommand(insertUser, conn, trans);
                        cmdUser.Parameters.AddWithValue("@id", newUserId);
                        cmdUser.Parameters.AddWithValue("@email", req.Email);
                        cmdUser.Parameters.AddWithValue("@pass", req.Password);
                        cmdUser.ExecuteNonQuery();

                        // Insert bảng Candidates
                        string insertCandidate = "INSERT INTO Candidates (Id, UserId, FullName) " +
                                                 "VALUES (NEWID(), @userId, @fullName)";
                        SqlCommand cmdCandidate = new SqlCommand(insertCandidate, conn, trans);
                        cmdCandidate.Parameters.AddWithValue("@userId", newUserId);
                        cmdCandidate.Parameters.AddWithValue("@fullName", req.FullName);
                        cmdCandidate.ExecuteNonQuery();

                        // Xác nhận lưu dữ liệu
                        trans.Commit();
                        return true;
                    }
                    catch
                    {
                        // Lỗi gì đó (trùng email, rớt mạng...) thì hủy toàn bộ thao tác
                        trans.Rollback();
                        return false;
                    }
                }
            }
        }
    }
}