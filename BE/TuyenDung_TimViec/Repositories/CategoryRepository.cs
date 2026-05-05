using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ICategoryRepository
    {
        Task<List<Category>> GetAllAsync(int? top = null);
        Task<bool> AddAsync(Category category);
        Task<bool> UpdateAsync(Category category);
        Task<bool> DeleteAsync(Guid id);
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
            
            string query = top.HasValue 
                ? $"SELECT TOP (@top) Id, Name, Icon, Color, BgColor FROM Categories" 
                : "SELECT Id, Name, Icon, Color, BgColor FROM Categories";

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
                                Id = reader.IsDBNull(0) ? Guid.Empty : reader.GetGuid(0),
                                Name = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                                IconName = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                                Color = reader.IsDBNull(3) ? string.Empty : reader.GetString(3),
                                BgColor = reader.IsDBNull(4) ? string.Empty : reader.GetString(4)
                            });
                        }
                    }
                }
            }

            return categories;
        }

        public async Task<bool> AddAsync(Category category)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO Categories (Id, Name, Icon, Color, BgColor) VALUES (@Id, @Name, @Icon, @Color, @BgColor)";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", Guid.NewGuid());
                    command.Parameters.AddWithValue("@Name", category.Name);
                    command.Parameters.AddWithValue("@Icon", (object)category.IconName ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Color", (object)category.Color ?? DBNull.Value);
                    command.Parameters.AddWithValue("@BgColor", (object)category.BgColor ?? DBNull.Value);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync() > 0;
                }
            }
        }

        public async Task<bool> UpdateAsync(Category category)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Categories SET Name = @Name, Icon = @Icon, Color = @Color, BgColor = @BgColor WHERE Id = @Id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", category.Id);
                    command.Parameters.AddWithValue("@Name", category.Name);
                    command.Parameters.AddWithValue("@Icon", (object)category.IconName ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Color", (object)category.Color ?? DBNull.Value);
                    command.Parameters.AddWithValue("@BgColor", (object)category.BgColor ?? DBNull.Value);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync() > 0;
                }
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Categories WHERE Id = @Id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync() > 0;
                }
            }
        }
    }
}
