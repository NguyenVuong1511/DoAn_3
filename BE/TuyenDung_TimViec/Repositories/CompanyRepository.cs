using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ICompanyRepository
    {
        Task<List<Company>> GetAllAsync(int? top = null);
    }

    public class CompanyRepository : ICompanyRepository
    {
        private readonly string _connectionString;

        public CompanyRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<Company>> GetAllAsync(int? top = null)
        {
            var companies = new List<Company>();
            
            string query = top.HasValue 
                ? $"SELECT TOP (@top) Id, Name, Logo FROM Companies" 
                : "SELECT Id, Name, Logo FROM Companies";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    if (top.HasValue)
                    {
                        command.Parameters.AddWithValue("@top", top.Value);
                    }

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            companies.Add(new Company
                            {
                                Id = reader.IsDBNull(0) ? Guid.Empty : reader.GetGuid(0),
                                Name = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                                LogoUrl = reader.IsDBNull(2) ? string.Empty : reader.GetString(2)
                            });
                        }
                    }
                }
            }

            return companies;
        }
    }
}