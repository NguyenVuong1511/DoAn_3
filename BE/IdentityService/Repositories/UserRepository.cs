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
        // Trả về: 1 (Thành công), 0 (Sai email/mật khẩu), -1 (Tài khoản bị khóa)
        public int ValidateUser(string email, string password, out string role, out Guid userId)
        {
            role = "";
            userId = Guid.Empty;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // Kiểm tra email và mật khẩu trước
                string query = "SELECT Id, Role, Status FROM Users WHERE Email = @email AND Password = @password";

                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@email", email);
                cmd.Parameters.AddWithValue("@password", password);

                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        string status = reader.GetString(2);
                        if (status == "LOCKED")
                        {
                            return -1; // Tài khoản bị khóa
                        }

                        userId = reader.GetGuid(0);
                        role = reader.GetString(1);
                        return 1; // Thành công
                    }
                }
            }
            return 0; // Sai email hoặc mật khẩu
        }

        // 2. Hàm Đăng Ký Ứng Viên (Candidate)
        public RepositoryResult<Guid> RegisterCandidate(RegisterCandidateRequest req)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // 1. Kiểm tra Email trước khi mở Transaction (Tối ưu performance)
                string checkEmailQuery = "SELECT COUNT(1) FROM Users WHERE Email = @email";
                using (SqlCommand checkCmd = new SqlCommand(checkEmailQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@email", req.Email);
                    if ((int)checkCmd.ExecuteScalar() > 0)
                    {
                        return RepositoryResult<Guid>.Fail("Email đã tồn tại trong hệ thống.");
                    }
                }

                using (SqlTransaction trans = conn.BeginTransaction())
                {
                    try
                    {
                        Guid newUserId = Guid.NewGuid();

                        // 2. Insert bảng Users
                        string insertUser = @"INSERT INTO Users (Id, Email, Password, Role, Status) 
                                     VALUES (@id, @email, @pass, 'CANDIDATE', 'ACTIVE')";

                        using (SqlCommand cmdUser = new SqlCommand(insertUser, conn, trans))
                        {
                            cmdUser.Parameters.AddWithValue("@id", newUserId);
                            cmdUser.Parameters.AddWithValue("@email", req.Email);
                            // Nhắc nhở: Hãy đảm bảo req.Password đã được Hash trước khi truyền vào đây
                            cmdUser.Parameters.AddWithValue("@pass", req.Password);
                            cmdUser.ExecuteNonQuery();
                        }

                        // 3. Insert bảng Candidates
                        string insertCandidate = @"INSERT INTO Candidates (Id, UserId, FullName, Phone, DateOfBirth, Gender, Address) 
                                         VALUES (NEWID(), @userId, @fullName, @phone, @dob, @gender, @address)";

                        using (SqlCommand cmdCandidate = new SqlCommand(insertCandidate, conn, trans))
                        {
                            cmdCandidate.Parameters.AddWithValue("@userId", newUserId);
                            cmdCandidate.Parameters.AddWithValue("@fullName", req.FullName);
                            cmdCandidate.Parameters.AddWithValue("@phone", (object)req.Phone ?? DBNull.Value);

                            // Xử lý DateOnly sang DateTime cho SQL Server
                            var dobValue = req.DateOfBirth.HasValue
                                ? (object)req.DateOfBirth.Value.ToDateTime(TimeOnly.MinValue)
                                : DBNull.Value;
                            cmdCandidate.Parameters.AddWithValue("@dob", dobValue);

                            cmdCandidate.Parameters.AddWithValue("@gender", (object)req.Gender ?? DBNull.Value);
                            cmdCandidate.Parameters.AddWithValue("@address", (object)req.Address ?? DBNull.Value);

                            cmdCandidate.ExecuteNonQuery();
                        }

                        trans.Commit();
                        return RepositoryResult<Guid>.Ok(newUserId, "Đăng ký ứng viên thành công.");
                    }
                    catch (Exception ex)
                    {
                        trans.Rollback();
                        // Ghi log ex ở đây
                        return RepositoryResult<Guid>.Fail("Lỗi hệ thống: " + ex.Message);
                    }
                }
            }
        }

        // 3. Hàm Đăng Ký Nhà Tuyển Dụng (Recruiter)
        public RepositoryResult<Guid> RegisterRecruiter(RegisterRecruiterRequest req)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // 1. Quick check for existing email before starting a transaction
                string checkEmailQuery = "SELECT COUNT(1) FROM Users WHERE Email = @email";
                using (SqlCommand checkCmd = new SqlCommand(checkEmailQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@email", req.Email);
                    if ((int)checkCmd.ExecuteScalar() > 0)
                        return RepositoryResult<Guid>.Fail("Email đã được sử dụng.");
                }

                using (SqlTransaction trans = conn.BeginTransaction())
                {
                    try
                    {
                        Guid newUserId = Guid.NewGuid();
                        Guid newCompanyId = Guid.NewGuid();

                        // 2. Insert into Users
                        string insertUser = @"INSERT INTO Users (Id, Email, Password, Role, Status, CreatedAt) 
                                     VALUES (@id, @email, @pass, 'RECRUITER', 'ACTIVE', GETDATE())";
                        using (SqlCommand cmdUser = new SqlCommand(insertUser, conn, trans))
                        {
                            cmdUser.Parameters.AddWithValue("@id", newUserId);
                            cmdUser.Parameters.AddWithValue("@email", req.Email);
                            cmdUser.Parameters.AddWithValue("@pass", req.Password); // Ensure this is hashed!
                            cmdUser.ExecuteNonQuery();
                        }

                        // 3. Insert into Companies
                        string insertCompany = @"INSERT INTO Companies (Id, Name, Address, Website, Description, IsVerified) 
                                         VALUES (@companyId, @name, @address, @website, @description, 0)";
                        using (SqlCommand cmdCompany = new SqlCommand(insertCompany, conn, trans))
                        {
                            cmdCompany.Parameters.AddWithValue("@companyId", newCompanyId);
                            cmdCompany.Parameters.AddWithValue("@name", req.CompanyName);
                            cmdCompany.Parameters.AddWithValue("@address", (object)req.CompanyAddress ?? DBNull.Value);
                            cmdCompany.Parameters.AddWithValue("@website", (object)req.CompanyWebsite ?? DBNull.Value);
                            cmdCompany.Parameters.AddWithValue("@description", (object)req.CompanyDescription ?? DBNull.Value);
                            cmdCompany.ExecuteNonQuery();
                        }

                        // 4. Insert into Recruiters (Linking Table)
                        string insertRecruiter = @"INSERT INTO Recruiters (Id, UserId, CompanyId) 
                                           VALUES (NEWID(), @userId, @companyId)";
                        using (SqlCommand cmdRecruiter = new SqlCommand(insertRecruiter, conn, trans))
                        {
                            cmdRecruiter.Parameters.AddWithValue("@userId", newUserId);
                            cmdRecruiter.Parameters.AddWithValue("@companyId", newCompanyId);
                            cmdRecruiter.ExecuteNonQuery();
                        }

                        trans.Commit();
                        return RepositoryResult<Guid>.Ok(newUserId, "Đăng ký nhà tuyển dụng thành công.");
                    }
                    catch (Exception ex)
                    {
                        trans.Rollback();
                        // Log the full 'ex' somewhere here
                        return RepositoryResult<Guid>.Fail("Lỗi hệ thống: " + ex.Message);
                    }
                }
            }
        }

        // 4. Đổi mật khẩu
        public RepositoryResult<bool> ChangePassword(ChangePasswordRequest req)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Users SET Password = @newPass WHERE Id = @id AND Password = @oldPass";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", req.UserId);
                    cmd.Parameters.AddWithValue("@oldPass", req.OldPassword);
                    cmd.Parameters.AddWithValue("@newPass", req.NewPassword);

                    conn.Open();
                    int rows = cmd.ExecuteNonQuery();
                    if (rows > 0) return RepositoryResult<bool>.Ok(true, "Đổi mật khẩu thành công.");
                    return RepositoryResult<bool>.Fail("Mật khẩu cũ không chính xác.");
                }
            }
        }

        // 5. Đổi Email
        public RepositoryResult<bool> ChangeEmail(ChangeEmailRequest req)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                // Check if new email already exists
                string checkQuery = "SELECT COUNT(1) FROM Users WHERE Email = @email AND Id != @id";
                using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@email", req.NewEmail);
                    checkCmd.Parameters.AddWithValue("@id", req.UserId);
                    if ((int)checkCmd.ExecuteScalar() > 0) return RepositoryResult<bool>.Fail("Email mới đã tồn tại.");
                }

                string query = "UPDATE Users SET Email = @newEmail WHERE Id = @id AND Password = @pass";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", req.UserId);
                    cmd.Parameters.AddWithValue("@pass", req.Password);
                    cmd.Parameters.AddWithValue("@newEmail", req.NewEmail);

                    int rows = cmd.ExecuteNonQuery();
                    if (rows > 0) return RepositoryResult<bool>.Ok(true, "Cập nhật email thành công.");
                    return RepositoryResult<bool>.Fail("Mật khẩu không chính xác.");
                }
            }
        }

        // 6. Cập nhật thông tin Candidate
        public RepositoryResult<bool> UpdateCandidateProfile(UpdateCandidateProfileRequest req)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Candidates SET FullName = @name, Phone = @phone, Address = @addr WHERE UserId = @userId";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@userId", req.UserId);
                    cmd.Parameters.AddWithValue("@name", req.FullName);
                    cmd.Parameters.AddWithValue("@phone", (object)req.Phone ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@addr", (object)req.Address ?? DBNull.Value);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                    return RepositoryResult<bool>.Ok(true, "Cập nhật thông tin thành công.");
                }
            }
        }

        // 7. Cập nhật thông tin Recruiter (Company info)
        public RepositoryResult<bool> UpdateRecruiterProfile(UpdateRecruiterProfileRequest req)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                using (SqlTransaction trans = conn.BeginTransaction())
                {
                    try
                    {
                        string getCompanyIdQuery = "SELECT CompanyId FROM Recruiters WHERE UserId = @userId";
                        Guid companyId = Guid.Empty;
                        using (SqlCommand cmdGet = new SqlCommand(getCompanyIdQuery, conn, trans))
                        {
                            cmdGet.Parameters.AddWithValue("@userId", req.UserId);
                            var res = cmdGet.ExecuteScalar();
                            if (res != null) companyId = (Guid)res;
                        }

                        if (companyId != Guid.Empty)
                        {
                            string query = "UPDATE Companies SET Name = @name, Address = @addr, Website = @web WHERE Id = @companyId";
                            using (SqlCommand cmd = new SqlCommand(query, conn, trans))
                            {
                                cmd.Parameters.AddWithValue("@companyId", companyId);
                                cmd.Parameters.AddWithValue("@name", req.CompanyName);
                                cmd.Parameters.AddWithValue("@addr", (object)req.CompanyAddress ?? DBNull.Value);
                                cmd.Parameters.AddWithValue("@web", (object)req.CompanyWebsite ?? DBNull.Value);
                                cmd.ExecuteNonQuery();
                            }
                        }

                        trans.Commit();
                        return RepositoryResult<bool>.Ok(true, "Cập nhật thông tin công ty thành công.");
                    }
                    catch (Exception ex)
                    {
                        trans.Rollback();
                        return RepositoryResult<bool>.Fail("Lỗi: " + ex.Message);
                    }
                }
            }
        }

        // 8. Lấy thông tin tài khoản
        public RepositoryResult<AccountInfoResponse> GetAccountInfo(Guid userId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT u.Id, u.Email, u.Role, c.FullName, c.Phone, comp.Name as CompanyName
                    FROM Users u
                    LEFT JOIN Candidates c ON u.Id = c.UserId
                    LEFT JOIN Recruiters r ON u.Id = r.UserId
                    LEFT JOIN Companies comp ON r.CompanyId = comp.Id
                    WHERE u.Id = @id";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", userId);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var info = new AccountInfoResponse
                            {
                                UserId = reader.GetGuid(0),
                                Email = reader.GetString(1),
                                Role = reader.GetString(2),
                                FullName = reader.IsDBNull(3) ? null : reader.GetString(3),
                                Phone = reader.IsDBNull(4) ? null : reader.GetString(4),
                                CompanyName = reader.IsDBNull(5) ? null : reader.GetString(5)
                            };
                            return RepositoryResult<AccountInfoResponse>.Ok(info, "Lấy thông tin thành công.");
                        }
                    }
                }
            }
            return RepositoryResult<AccountInfoResponse>.Fail("Không tìm thấy người dùng.");
        }

        // 9. Lấy danh sách toàn bộ người dùng (Admin)
        public RepositoryResult<List<object>> GetAllUsers()
        {
            var users = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT u.Id, u.Email, u.Role, u.Status, u.CreatedAt, 
                           c.FullName, r.CompanyId, comp.Name as CompanyName,
                           c.Avatar, comp.Logo as CompanyLogo
                    FROM Users u
                    LEFT JOIN Candidates c ON u.Id = c.UserId
                    LEFT JOIN Recruiters r ON u.Id = r.UserId
                    LEFT JOIN Companies comp ON r.CompanyId = comp.Id
                    ORDER BY u.CreatedAt DESC";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            users.Add(new
                            {
                                id = reader.GetGuid(0),
                                email = reader.GetString(1),
                                role = reader.GetString(2),
                                status = reader.GetString(3),
                                createdAt = reader.GetDateTime(4),
                                fullName = reader.IsDBNull(5) ? null : reader.GetString(5),
                                companyId = reader.IsDBNull(6) ? null : (Guid?)reader.GetGuid(6),
                                companyName = reader.IsDBNull(7) ? null : reader.GetString(7),
                                avatar = reader.IsDBNull(8) ? null : reader.GetString(8),
                                companyLogo = reader.IsDBNull(9) ? null : reader.GetString(9)
                            });
                        }
                    }
                }
            }
            return RepositoryResult<List<object>>.Ok(users, "Lấy danh sách người dùng thành công.");
        }

        // 10. Khóa/Mở khóa tài khoản (Admin)
        public RepositoryResult<bool> ToggleUserStatus(Guid userId)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Users SET Status = CASE WHEN Status = 'ACTIVE' THEN 'LOCKED' ELSE 'ACTIVE' END WHERE Id = @id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", userId);
                    conn.Open();
                    int rows = cmd.ExecuteNonQuery();
                    if (rows > 0) return RepositoryResult<bool>.Ok(true, "Cập nhật trạng thái thành công.");
                }
            }
            return RepositoryResult<bool>.Fail("Không tìm thấy người dùng.");
        }
    }
}