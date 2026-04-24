using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ICVRepository
    {
        Task<CVDetail?> GetCVDetailByUserIdAsync(Guid userId);
    }

    public class CVRepository : ICVRepository
    {
        private readonly string _connectionString;

        public CVRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<CVDetail?> GetCVDetailByUserIdAsync(Guid userId)
        {
            CVDetail? cv = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // 1. Get the CV (Join with Candidates to filter by UserId)
                string queryCV = @"
                    SELECT TOP 1 cv.* 
                    FROM CVs cv
                    INNER JOIN Candidates c ON cv.CandidateId = c.Id
                    WHERE c.UserId = @UserId 
                    ORDER BY cv.IsDefault DESC, cv.UploadDate DESC";

                using (SqlCommand cmd = new SqlCommand(queryCV, connection))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            cv = new CVDetail
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                CandidateId = reader.GetGuid(reader.GetOrdinal("CandidateId")),
                                Title = reader.IsDBNull(reader.GetOrdinal("Title")) ? string.Empty : reader.GetString(reader.GetOrdinal("Title")),
                                Type = reader.IsDBNull(reader.GetOrdinal("Type")) ? string.Empty : reader.GetString(reader.GetOrdinal("Type")),
                                FileUrl = reader.IsDBNull(reader.GetOrdinal("FileUrl")) ? string.Empty : reader.GetString(reader.GetOrdinal("FileUrl")),
                                UploadDate = reader.IsDBNull(reader.GetOrdinal("UploadDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("UploadDate")),
                                IsDefault = reader.IsDBNull(reader.GetOrdinal("IsDefault")) ? false : reader.GetBoolean(reader.GetOrdinal("IsDefault"))
                            };
                        }
                    }
                }

                if (cv == null) return null;

                // 2. Get Educations
                string queryEdu = "SELECT * FROM CVEducations WHERE CVId = @CVId";
                using (SqlCommand cmd = new SqlCommand(queryEdu, connection))
                {
                    cmd.Parameters.AddWithValue("@CVId", cv.Id);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            cv.Educations.Add(new CVEducation
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                CVId = reader.GetGuid(reader.GetOrdinal("CVId")),
                                SchoolName = reader.IsDBNull(reader.GetOrdinal("SchoolName")) ? string.Empty : reader.GetString(reader.GetOrdinal("SchoolName")),
                                Major = reader.IsDBNull(reader.GetOrdinal("Major")) ? string.Empty : reader.GetString(reader.GetOrdinal("Major")),
                                StartDate = reader.IsDBNull(reader.GetOrdinal("StartDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? string.Empty : reader.GetString(reader.GetOrdinal("Description"))
                            });
                        }
                    }
                }

                // 3. Get Experiences
                string queryExp = "SELECT * FROM CVExperiences WHERE CVId = @CVId";
                using (SqlCommand cmd = new SqlCommand(queryExp, connection))
                {
                    cmd.Parameters.AddWithValue("@CVId", cv.Id);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            cv.Experiences.Add(new CVExperience
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                CVId = reader.GetGuid(reader.GetOrdinal("CVId")),
                                CompanyName = reader.IsDBNull(reader.GetOrdinal("CompanyName")) ? string.Empty : reader.GetString(reader.GetOrdinal("CompanyName")),
                                Position = reader.IsDBNull(reader.GetOrdinal("Position")) ? string.Empty : reader.GetString(reader.GetOrdinal("Position")),
                                StartDate = reader.IsDBNull(reader.GetOrdinal("StartDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? string.Empty : reader.GetString(reader.GetOrdinal("Description"))
                            });
                        }
                    }
                }

                // 4. Get Skills
                string querySkill = "SELECT * FROM CVSkills WHERE CVId = @CVId";
                using (SqlCommand cmd = new SqlCommand(querySkill, connection))
                {
                    cmd.Parameters.AddWithValue("@CVId", cv.Id);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            cv.Skills.Add(new CVSkill
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                CVId = reader.GetGuid(reader.GetOrdinal("CVId")),
                                SkillName = reader.IsDBNull(reader.GetOrdinal("SkillName")) ? string.Empty : reader.GetString(reader.GetOrdinal("SkillName")),
                                Level = reader.IsDBNull(reader.GetOrdinal("Level")) ? string.Empty : reader.GetString(reader.GetOrdinal("Level"))
                            });
                        }
                    }
                }
            }

            return cv;
        }
    }
}
