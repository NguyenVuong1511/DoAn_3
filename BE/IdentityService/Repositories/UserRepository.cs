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
    }
}