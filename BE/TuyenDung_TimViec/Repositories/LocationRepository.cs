using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ILocationRepository
    {
        Task<List<Location>> GetAllAsync();
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
    }
}
