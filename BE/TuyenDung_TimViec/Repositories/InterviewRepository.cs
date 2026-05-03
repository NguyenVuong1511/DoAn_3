using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface IInterviewRepository
    {
        Task<bool> ScheduleInterviewAsync(Interview interview);
        Task<List<Interview>> GetInterviewsByCandidateIdAsync(Guid userId);
        Task<List<Interview>> GetInterviewsByApplicationIdAsync(Guid applicationId);
        Task<List<Interview>> GetInterviewsByCompanyIdAsync(Guid companyId);
        Task<bool> UpdateInterviewStatusAsync(Guid interviewId, string status);
        Task<bool> UpdateInterviewAsync(Interview interview);
    }

    public class InterviewRepository : IInterviewRepository
    {
        private readonly string _connectionString;

        public InterviewRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        private async Task<Guid> GetCandidateIdByUserIdAsync(Guid userId, SqlConnection connection)
        {
            string query = "SELECT Id FROM Candidates WHERE UserId = @UserId";
            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@UserId", userId);
                var result = await command.ExecuteScalarAsync();
                return result != null ? (Guid)result : Guid.Empty;
            }
        }

        public async Task<bool> ScheduleInterviewAsync(Interview interview)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                string query = @"
                    INSERT INTO Interviews (Id, ApplicationId, InterviewDate, Location, Notes, Status, CreatedAt)
                    VALUES (@Id, @ApplicationId, @InterviewDate, @Location, @Notes, @Status, @CreatedAt)";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", Guid.NewGuid());
                    command.Parameters.AddWithValue("@ApplicationId", interview.ApplicationId);
                    command.Parameters.AddWithValue("@InterviewDate", interview.InterviewDate);
                    command.Parameters.AddWithValue("@Location", (object)interview.Location ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Notes", (object)interview.Notes ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Status", "Pending");
                    command.Parameters.AddWithValue("@CreatedAt", DateTime.Now);

                    int result = await command.ExecuteNonQueryAsync();
                    
                    // Automatically update application status to 'Interviewing'
                    if (result > 0)
                    {
                        string updateAppQuery = "UPDATE Applications SET Status = 'Interviewing' WHERE Id = @AppId";
                        using (SqlCommand updateCmd = new SqlCommand(updateAppQuery, connection))
                        {
                            updateCmd.Parameters.AddWithValue("@AppId", interview.ApplicationId);
                            await updateCmd.ExecuteNonQueryAsync();
                        }
                    }

                    return result > 0;
                }
            }
        }

        public async Task<List<Interview>> GetInterviewsByCandidateIdAsync(Guid userId)
        {
            var interviews = new List<Interview>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                Guid candidateId = await GetCandidateIdByUserIdAsync(userId, connection);
                if (candidateId == Guid.Empty) return interviews;

                string query = @"
                    SELECT i.*, jp.Title as JobTitle, c.Name as CompanyName, c.Logo as CompanyLogo
                    FROM Interviews i
                    INNER JOIN Applications a ON i.ApplicationId = a.Id
                    INNER JOIN JobPosts jp ON a.JobPostId = jp.Id
                    INNER JOIN Companies c ON jp.CompanyId = c.Id
                    WHERE a.CandidateId = @CandidateId
                    ORDER BY i.InterviewDate ASC";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CandidateId", candidateId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            interviews.Add(new Interview
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                ApplicationId = reader.GetGuid(reader.GetOrdinal("ApplicationId")),
                                InterviewDate = reader.GetDateTime(reader.GetOrdinal("InterviewDate")),
                                Location = reader.IsDBNull(reader.GetOrdinal("Location")) ? null : reader.GetString(reader.GetOrdinal("Location")),
                                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                JobTitle = reader.GetString(reader.GetOrdinal("JobTitle")),
                                CompanyName = reader.GetString(reader.GetOrdinal("CompanyName")),
                                CompanyLogo = reader.GetString(reader.GetOrdinal("CompanyLogo"))
                            });
                        }
                    }
                }
            }
            return interviews;
        }

        public async Task<List<Interview>> GetInterviewsByApplicationIdAsync(Guid applicationId)
        {
            var interviews = new List<Interview>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                string query = "SELECT * FROM Interviews WHERE ApplicationId = @ApplicationId ORDER BY InterviewDate ASC";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@ApplicationId", applicationId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            interviews.Add(new Interview
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                ApplicationId = reader.GetGuid(reader.GetOrdinal("ApplicationId")),
                                InterviewDate = reader.GetDateTime(reader.GetOrdinal("InterviewDate")),
                                Location = reader.IsDBNull(reader.GetOrdinal("Location")) ? null : reader.GetString(reader.GetOrdinal("Location")),
                                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt"))
                            });
                        }
                    }
                }
            }
            return interviews;
        }

        public async Task<List<Interview>> GetInterviewsByCompanyIdAsync(Guid companyId)
        {
            var interviews = new List<Interview>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                string query = @"
                    SELECT i.*, jp.Title as JobTitle, c.Name as CompanyName, c.Logo as CompanyLogo, can.FullName as CandidateName, can.Avatar as CandidateAvatar
                    FROM Interviews i
                    INNER JOIN Applications a ON i.ApplicationId = a.Id
                    INNER JOIN Candidates can ON a.CandidateId = can.Id
                    INNER JOIN JobPosts jp ON a.JobPostId = jp.Id
                    INNER JOIN Companies c ON jp.CompanyId = c.Id
                    WHERE c.Id = @CompanyId
                    ORDER BY i.InterviewDate DESC";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CompanyId", companyId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            interviews.Add(new Interview
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                ApplicationId = reader.GetGuid(reader.GetOrdinal("ApplicationId")),
                                InterviewDate = reader.GetDateTime(reader.GetOrdinal("InterviewDate")),
                                Location = reader.IsDBNull(reader.GetOrdinal("Location")) ? null : reader.GetString(reader.GetOrdinal("Location")),
                                Notes = reader.IsDBNull(reader.GetOrdinal("Notes")) ? null : reader.GetString(reader.GetOrdinal("Notes")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                                JobTitle = reader.GetString(reader.GetOrdinal("JobTitle")),
                                CompanyName = reader.GetString(reader.GetOrdinal("CompanyName")),
                                CompanyLogo = reader.GetString(reader.GetOrdinal("CompanyLogo")),
                                CandidateName = reader.GetString(reader.GetOrdinal("CandidateName")),
                                CandidateAvatar = reader.IsDBNull(reader.GetOrdinal("CandidateAvatar")) ? null : reader.GetString(reader.GetOrdinal("CandidateAvatar"))
                            });
                        }
                    }
                }
            }
            return interviews;
        }

        public async Task<bool> UpdateInterviewStatusAsync(Guid interviewId, string status)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                string query = "UPDATE Interviews SET Status = @Status WHERE Id = @Id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Status", status);
                    command.Parameters.AddWithValue("@Id", interviewId);
                    int result = await command.ExecuteNonQueryAsync();
                    return result > 0;
                }
            }
        }

        public async Task<bool> UpdateInterviewAsync(Interview interview)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                string query = @"
                    UPDATE Interviews 
                    SET InterviewDate = @InterviewDate, Location = @Location, Notes = @Notes 
                    WHERE Id = @Id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@InterviewDate", interview.InterviewDate);
                    command.Parameters.AddWithValue("@Location", (object)interview.Location ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Notes", (object)interview.Notes ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Id", interview.Id);
                    int result = await command.ExecuteNonQueryAsync();
                    return result > 0;
                }
            }
        }
    }
}
