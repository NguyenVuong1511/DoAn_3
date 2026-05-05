using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ICompanyRepository
    {
        Task<List<Company>> GetAllAsync(int? top = null);
        Task<Company?> GetByIdAsync(Guid id);
        Task<Company?> GetByUserIdAsync(Guid userId);
        Task<bool> UpdateAsync(Company company);
        Task<bool> ToggleVerifyAsync(Guid companyId);
    }

    public class CompanyRepository : ICompanyRepository
    {
        private readonly string _connectionString;

        public CompanyRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private Company MapCompany(SqlDataReader reader)
        {
            return new Company
            {
                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                Name = reader.IsDBNull(reader.GetOrdinal("Name")) ? string.Empty : reader.GetString(reader.GetOrdinal("Name")),
                LogoUrl = reader.IsDBNull(reader.GetOrdinal("Logo")) ? null : reader.GetString(reader.GetOrdinal("Logo")),
                Address = reader.IsDBNull(reader.GetOrdinal("Address")) ? null : reader.GetString(reader.GetOrdinal("Address")),
                Website = reader.IsDBNull(reader.GetOrdinal("Website")) ? null : reader.GetString(reader.GetOrdinal("Website")),
                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                IsVerified = !reader.IsDBNull(reader.GetOrdinal("IsVerified")) && reader.GetBoolean(reader.GetOrdinal("IsVerified")),
                Industry = reader.IsDBNull(reader.GetOrdinal("Industry")) ? null : reader.GetString(reader.GetOrdinal("Industry")),
                Size = reader.IsDBNull(reader.GetOrdinal("Size")) ? null : reader.GetString(reader.GetOrdinal("Size")),
                Phone = reader.IsDBNull(reader.GetOrdinal("Phone")) ? null : reader.GetString(reader.GetOrdinal("Phone")),
                Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? null : reader.GetString(reader.GetOrdinal("Email")),
                CoverImage = reader.IsDBNull(reader.GetOrdinal("CoverImage")) ? null : reader.GetString(reader.GetOrdinal("CoverImage")),
                Culture = reader.IsDBNull(reader.GetOrdinal("Culture")) ? null : reader.GetString(reader.GetOrdinal("Culture")),
                Benefits = reader.IsDBNull(reader.GetOrdinal("Benefits")) ? null : reader.GetString(reader.GetOrdinal("Benefits"))
            };
        }

        public async Task<List<Company>> GetAllAsync(int? top = null)
        {
            var companies = new List<Company>();
            string query = top.HasValue 
                ? "SELECT TOP (@top) * FROM Companies" 
                : "SELECT * FROM Companies";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    if (top.HasValue) command.Parameters.AddWithValue("@top", top.Value);
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            companies.Add(MapCompany(reader));
                        }
                    }
                }
            }
            return companies;
        }

        public async Task<Company?> GetByIdAsync(Guid id)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Companies WHERE Id = @Id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync()) return MapCompany(reader);
                    }
                }
            }
            return null;
        }

        public async Task<Company?> GetByUserIdAsync(Guid userId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"
                    SELECT c.* 
                    FROM Companies c
                    INNER JOIN Recruiters r ON c.Id = r.CompanyId
                    WHERE r.UserId = @UserId";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@UserId", userId);
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync()) return MapCompany(reader);
                    }
                }
            }
            return null;
        }

        public async Task<bool> UpdateAsync(Company company)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"
                    UPDATE Companies 
                    SET Name = @Name, Logo = @Logo, Address = @Address, Website = @Website, 
                        Description = @Description, Industry = @Industry, Size = @Size, 
                        Phone = @Phone, Email = @Email, CoverImage = @CoverImage, 
                        Culture = @Culture, Benefits = @Benefits
                    WHERE Id = @Id";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", company.Id);
                    command.Parameters.AddWithValue("@Name", company.Name);
                    command.Parameters.AddWithValue("@Logo", (object)company.LogoUrl ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Address", (object)company.Address ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Website", (object)company.Website ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Description", (object)company.Description ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Industry", (object)company.Industry ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Size", (object)company.Size ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Phone", (object)company.Phone ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Email", (object)company.Email ?? DBNull.Value);
                    command.Parameters.AddWithValue("@CoverImage", (object)company.CoverImage ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Culture", (object)company.Culture ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Benefits", (object)company.Benefits ?? DBNull.Value);

                    await connection.OpenAsync();
                    int result = await command.ExecuteNonQueryAsync();
                    return result > 0;
                }
            }
        }

        public async Task<bool> ToggleVerifyAsync(Guid companyId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Companies SET IsVerified = CASE WHEN IsVerified = 1 THEN 0 ELSE 1 END WHERE Id = @Id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", companyId);
                    await connection.OpenAsync();
                    int result = await command.ExecuteNonQueryAsync();
                    return result > 0;
                }
            }
        }
    }
}