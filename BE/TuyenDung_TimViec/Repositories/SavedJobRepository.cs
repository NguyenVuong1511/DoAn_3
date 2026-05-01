using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ISavedJobRepository
    {
        Task<bool> ToggleSavedJobAsync(Guid userId, Guid jobPostId);
        Task<(List<JobPost> Jobs, int TotalCount)> GetPagedSavedJobsAsync(Guid userId, int pageNumber, int pageSize);
        Task<bool> IsJobSavedAsync(Guid userId, Guid jobPostId);
    }

    public class SavedJobRepository : ISavedJobRepository
    {
        private readonly string _connectionString;

        public SavedJobRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private async Task<Guid> GetCandidateIdByUserIdAsync(Guid userId, SqlConnection connection, SqlTransaction transaction = null)
        {
            string query = "SELECT Id FROM Candidates WHERE UserId = @UserId";
            using (SqlCommand command = new SqlCommand(query, connection, transaction))
            {
                command.Parameters.AddWithValue("@UserId", userId);
                var result = await command.ExecuteScalarAsync();
                return result != null ? (Guid)result : Guid.Empty;
            }
        }

        public async Task<bool> IsJobSavedAsync(Guid userId, Guid jobPostId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                Guid candidateId = await GetCandidateIdByUserIdAsync(userId, connection);
                if (candidateId == Guid.Empty) return false;

                string query = "SELECT COUNT(1) FROM SavedJobs WHERE CandidateId = @CandidateId AND JobPostId = @JobPostId";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CandidateId", candidateId);
                    command.Parameters.AddWithValue("@JobPostId", jobPostId);
                    var count = (int)await command.ExecuteScalarAsync();
                    return count > 0;
                }
            }
        }

        public async Task<bool> ToggleSavedJobAsync(Guid userId, Guid jobPostId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                Guid candidateId = await GetCandidateIdByUserIdAsync(userId, connection);
                if (candidateId == Guid.Empty) throw new Exception("Candidate not found for this user.");

                bool isSaved = await IsJobSavedAsync(userId, jobPostId);

                if (isSaved)
                {
                    string deleteQuery = "DELETE FROM SavedJobs WHERE CandidateId = @CandidateId AND JobPostId = @JobPostId";
                    using (SqlCommand command = new SqlCommand(deleteQuery, connection))
                    {
                        command.Parameters.AddWithValue("@CandidateId", candidateId);
                        command.Parameters.AddWithValue("@JobPostId", jobPostId);
                        await command.ExecuteNonQueryAsync();
                    }
                    return false; // Removed
                }
                else
                {
                    string insertQuery = "INSERT INTO SavedJobs (Id, CandidateId, JobPostId, SavedDate) VALUES (NEWID(), @CandidateId, @JobPostId, GETDATE())";
                    using (SqlCommand command = new SqlCommand(insertQuery, connection))
                    {
                        command.Parameters.AddWithValue("@CandidateId", candidateId);
                        command.Parameters.AddWithValue("@JobPostId", jobPostId);
                        await command.ExecuteNonQueryAsync();
                    }
                    return true; // Added
                }
            }
        }

        public async Task<(List<JobPost> Jobs, int TotalCount)> GetPagedSavedJobsAsync(Guid userId, int pageNumber, int pageSize)
        {
            var jobPosts = new List<JobPost>();
            int totalCount = 0;
            int offset = (pageNumber - 1) * pageSize;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                Guid candidateId = await GetCandidateIdByUserIdAsync(userId, connection);
                if (candidateId == Guid.Empty) return (jobPosts, 0);

                string query = @"
                    SELECT jp.*, 
                           c.Name as CompanyName, c.Logo as CompanyLogo, 
                           l.Name as LocationName, jt.Name as JobTypeName,
                           jl.Name as LevelName, el.Name as ExperienceName
                    FROM SavedJobs sj
                    INNER JOIN JobPosts jp ON sj.JobPostId = jp.Id
                    LEFT JOIN Companies c ON jp.CompanyId = c.Id
                    LEFT JOIN Locations l ON jp.LocationId = l.Id
                    LEFT JOIN JobTypes jt ON jp.JobTypeId = jt.Id
                    LEFT JOIN Levels jl ON jp.LevelId = jl.Id
                    LEFT JOIN Experiences el ON jp.ExperienceId = el.Id
                    WHERE sj.CandidateId = @CandidateId
                    ORDER BY sj.SavedDate DESC
                    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;

                    SELECT COUNT(*) FROM SavedJobs WHERE CandidateId = @CandidateId;";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CandidateId", candidateId);
                    command.Parameters.AddWithValue("@offset", offset);
                    command.Parameters.AddWithValue("@pageSize", pageSize);

                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            jobPosts.Add(new JobPost
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                Title = reader.IsDBNull(reader.GetOrdinal("Title")) ? string.Empty : reader.GetString(reader.GetOrdinal("Title")),
                                MinSalary = reader.IsDBNull(reader.GetOrdinal("MinSalary")) ? 0 : reader.GetDecimal(reader.GetOrdinal("MinSalary")),
                                MaxSalary = reader.IsDBNull(reader.GetOrdinal("MaxSalary")) ? 0 : reader.GetDecimal(reader.GetOrdinal("MaxSalary")),
                                CompanyName = reader.IsDBNull(reader.GetOrdinal("CompanyName")) ? string.Empty : reader.GetString(reader.GetOrdinal("CompanyName")),
                                CompanyLogo = reader.IsDBNull(reader.GetOrdinal("CompanyLogo")) ? string.Empty : reader.GetString(reader.GetOrdinal("CompanyLogo")),
                                LocationName = reader.IsDBNull(reader.GetOrdinal("LocationName")) ? string.Empty : reader.GetString(reader.GetOrdinal("LocationName")),
                                JobTypeName = reader.IsDBNull(reader.GetOrdinal("JobTypeName")) ? string.Empty : reader.GetString(reader.GetOrdinal("JobTypeName")),
                                LevelName = reader.IsDBNull(reader.GetOrdinal("LevelName")) ? string.Empty : reader.GetString(reader.GetOrdinal("LevelName")),
                                ExperienceName = reader.IsDBNull(reader.GetOrdinal("ExperienceName")) ? string.Empty : reader.GetString(reader.GetOrdinal("ExperienceName")),
                                PostDate = reader.IsDBNull(reader.GetOrdinal("PostDate")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("PostDate"))
                            });
                        }

                        if (await reader.NextResultAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                totalCount = reader.GetInt32(0);
                            }
                        }
                    }
                }
            }
            return (jobPosts, totalCount);
        }
    }
}
