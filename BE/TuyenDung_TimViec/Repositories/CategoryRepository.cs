using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllAsync(int? top = null);
    }

    public class CategoryRepository : ICategoryRepository
    {
        private readonly string _connectionString;

        public CategoryRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<Category>> GetAllAsync(int? top = null)
        {
            var categories = new List<Category>();
            
            // Câu lệnh SQL linh hoạt: Nếu có top thì dùng SELECT TOP, ngược lại dùng SELECT bình thường
            string query = top.HasValue 
                ? $"SELECT TOP (@top) Id, Name FROM Categories" 
                : "SELECT Id, Name FROM Categories";

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
                            categories.Add(new Category
                            {
                                Id = reader.GetGuid(0),
                                Name = reader.GetString(1)
                            });
                        }
                    }
                }
            }

            return categories;
        }
    }
}
