using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ILocationRepository
    {
        Task<List<Location>> GetAllAsync();
        Task<bool> AddAsync(Location location);
        Task<bool> UpdateAsync(Location location);
        Task<bool> DeleteAsync(Guid id);
    }

    public class LocationRepository : ILocationRepository
    {
        private readonly string _connectionString;

        public LocationRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<Location>> GetAllAsync()
        {
            var locations = new List<Location>();
            string query = "SELECT Id, Name FROM Locations ORDER BY Name";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            locations.Add(new Location
                            {
                                Id = reader.IsDBNull(0) ? Guid.Empty : reader.GetGuid(0),
                                Name = reader.IsDBNull(1) ? string.Empty : reader.GetString(1)
                            });
                        }
                    }
                }
            }

            return locations;
        }

        public async Task<bool> AddAsync(Location location)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "INSERT INTO Locations (Id, Name) VALUES (@Id, @Name)";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", Guid.NewGuid());
                    command.Parameters.AddWithValue("@Name", location.Name);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync() > 0;
                }
            }
        }

        public async Task<bool> UpdateAsync(Location location)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "UPDATE Locations SET Name = @Name WHERE Id = @Id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", location.Id);
                    command.Parameters.AddWithValue("@Name", location.Name);

                    await connection.OpenAsync();
                    return await command.ExecuteNonQueryAsync() > 0;
                }
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Locations WHERE Id = @Id";
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
