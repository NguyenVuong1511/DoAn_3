using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface IJobApplicationRepository
    {
        Task<bool> ApplyJobAsync(JobApplication application);
        Task<List<JobApplication>> GetApplicationsByCandidateIdAsync(Guid userId);
        Task<List<JobApplication>> GetApplicationsByJobPostIdAsync(Guid jobPostId);
        Task<bool> UpdateApplicationStatusAsync(Guid applicationId, string status, string? note);
        Task<bool> CheckIfAppliedAsync(Guid userId, Guid jobPostId);
        Task<bool> WithdrawApplicationAsync(Guid applicationId);
        Task<List<JobApplication>> GetApplicationsByCompanyIdAsync(Guid companyId);
    }

    public class JobApplicationRepository : IJobApplicationRepository
    {
        private readonly string _connectionString;

        public JobApplicationRepository(IConfiguration configuration)
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

        public async Task<bool> ApplyJobAsync(JobApplication application)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                
                // If the provided CandidateId doesn't exist, try resolving it from UserId
                Guid finalCandidateId = application.CandidateId;
                string checkQuery = "SELECT COUNT(1) FROM Candidates WHERE Id = @CandidateId";
                using (SqlCommand checkCmd = new SqlCommand(checkQuery, connection))
                {
                    checkCmd.Parameters.AddWithValue("@CandidateId", application.CandidateId);
                    int exists = (int)await checkCmd.ExecuteScalarAsync();
                    if (exists == 0)
                    {
                        finalCandidateId = await GetCandidateIdByUserIdAsync(application.CandidateId, connection);
                    }
                }

                if (finalCandidateId == Guid.Empty) return false;

                // Check if already applied
                string alreadyQuery = "SELECT COUNT(1) FROM Applications WHERE CandidateId = @CandidateId AND JobPostId = @JobPostId";
                using (SqlCommand alreadyCmd = new SqlCommand(alreadyQuery, connection))
                {
                    alreadyCmd.Parameters.AddWithValue("@CandidateId", finalCandidateId);
                    alreadyCmd.Parameters.AddWithValue("@JobPostId", application.JobPostId);
                    int alreadyCount = (int)await alreadyCmd.ExecuteScalarAsync();
                if (alreadyCount > 0)
                {
                    string updateQuery = "UPDATE Applications SET CVType = @CVType, CoverLetter = @CoverLetter, ApplyDate = @ApplyDate WHERE CandidateId = @CandidateId AND JobPostId = @JobPostId";
                    using (SqlCommand updateCmd = new SqlCommand(updateQuery, connection))
                    {
                        updateCmd.Parameters.AddWithValue("@CVType", string.IsNullOrWhiteSpace(application.CVType) ? "Online" : application.CVType);
                        updateCmd.Parameters.AddWithValue("@CoverLetter", (object)application.CoverLetter ?? DBNull.Value);
                        updateCmd.Parameters.AddWithValue("@ApplyDate", DateTime.Now);
                        updateCmd.Parameters.AddWithValue("@CandidateId", finalCandidateId);
                        updateCmd.Parameters.AddWithValue("@JobPostId", application.JobPostId);
                        await updateCmd.ExecuteNonQueryAsync();
                        return true;
                    }
                }
                }

                string query = @"
                    INSERT INTO Applications (Id, CandidateId, JobPostId, CVId, ApplyDate, CoverLetter, Status, CVType)
                    VALUES (@Id, @CandidateId, @JobPostId, @CVId, @ApplyDate, @CoverLetter, @Status, @CVType)";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", Guid.NewGuid());
                    command.Parameters.AddWithValue("@CandidateId", finalCandidateId);
                    command.Parameters.AddWithValue("@JobPostId", application.JobPostId);
                    command.Parameters.AddWithValue("@CVId", application.CVId);
                    command.Parameters.AddWithValue("@ApplyDate", DateTime.Now);
                    command.Parameters.AddWithValue("@CoverLetter", (object)application.CoverLetter ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Status", "Pending");
                    command.Parameters.AddWithValue("@CVType", string.IsNullOrWhiteSpace(application.CVType) ? "Online" : application.CVType);

                    int result = await command.ExecuteNonQueryAsync();
                    return result > 0;
                }
            }
        }

        public async Task<List<JobApplication>> GetApplicationsByCandidateIdAsync(Guid userId)
        {
            var applications = new List<JobApplication>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                Guid candidateId = await GetCandidateIdByUserIdAsync(userId, connection);
                if (candidateId == Guid.Empty) return applications;

                string query = @"
                    SELECT a.*, jp.Title as JobTitle, c.Name as CompanyName, c.Logo as CompanyLogo, cv.Title as CVTitle
                    FROM Applications a
                    INNER JOIN JobPosts jp ON a.JobPostId = jp.Id
                    INNER JOIN Companies c ON jp.CompanyId = c.Id
                    LEFT JOIN CVs cv ON a.CVId = cv.Id
                    WHERE a.CandidateId = @CandidateId
                    ORDER BY a.ApplyDate DESC";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CandidateId", candidateId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            applications.Add(new JobApplication
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                CandidateId = reader.GetGuid(reader.GetOrdinal("CandidateId")),
                                JobPostId = reader.GetGuid(reader.GetOrdinal("JobPostId")),
                                CVId = reader.GetGuid(reader.GetOrdinal("CVId")),
                                ApplyDate = reader.GetDateTime(reader.GetOrdinal("ApplyDate")),
                                CoverLetter = reader.IsDBNull(reader.GetOrdinal("CoverLetter")) ? null : reader.GetString(reader.GetOrdinal("CoverLetter")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                CVType = reader.IsDBNull(reader.GetOrdinal("CVType")) ? "Online" : reader.GetString(reader.GetOrdinal("CVType")),
                                EmployerNote = reader.IsDBNull(reader.GetOrdinal("EmployerNote")) ? null : reader.GetString(reader.GetOrdinal("EmployerNote")),
                                JobTitle = reader.GetString(reader.GetOrdinal("JobTitle")),
                                CompanyName = reader.GetString(reader.GetOrdinal("CompanyName")),
                                CompanyLogo = reader.GetString(reader.GetOrdinal("CompanyLogo")),
                                CVTitle = reader.IsDBNull(reader.GetOrdinal("CVTitle")) ? "Online CV" : reader.GetString(reader.GetOrdinal("CVTitle"))
                            });
                        }
                    }
                }
            }
            return applications;
        }

        public async Task<List<JobApplication>> GetApplicationsByJobPostIdAsync(Guid jobPostId)
        {
            var applications = new List<JobApplication>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                string query = @"
                    SELECT a.*, cand.FullName as CandidateName, cand.UserId as CandidateUserId, cv.Title as CVTitle
                    FROM Applications a
                    INNER JOIN Candidates cand ON a.CandidateId = cand.Id
                    LEFT JOIN CVs cv ON a.CVId = cv.Id
                    WHERE a.JobPostId = @JobPostId
                    ORDER BY a.ApplyDate DESC";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@JobPostId", jobPostId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            applications.Add(new JobApplication
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                CandidateId = reader.GetGuid(reader.GetOrdinal("CandidateId")),
                                JobPostId = reader.GetGuid(reader.GetOrdinal("JobPostId")),
                                CVId = reader.GetGuid(reader.GetOrdinal("CVId")),
                                ApplyDate = reader.GetDateTime(reader.GetOrdinal("ApplyDate")),
                                CoverLetter = reader.IsDBNull(reader.GetOrdinal("CoverLetter")) ? null : reader.GetString(reader.GetOrdinal("CoverLetter")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                CVType = reader.IsDBNull(reader.GetOrdinal("CVType")) ? "Online" : reader.GetString(reader.GetOrdinal("CVType")),
                                EmployerNote = reader.IsDBNull(reader.GetOrdinal("EmployerNote")) ? null : reader.GetString(reader.GetOrdinal("EmployerNote")),
                                CandidateName = reader.GetString(reader.GetOrdinal("CandidateName")),
                                CVTitle = reader.IsDBNull(reader.GetOrdinal("CVTitle")) ? "Online CV" : reader.GetString(reader.GetOrdinal("CVTitle")),
                                CandidateUserId = reader.IsDBNull(reader.GetOrdinal("CandidateUserId")) ? (Guid?)null : reader.GetGuid(reader.GetOrdinal("CandidateUserId"))
                            });
                        }
                    }
                }
            }
            return applications;
        }

        public async Task<bool> UpdateApplicationStatusAsync(Guid applicationId, string status, string? note)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                string query = "UPDATE Applications SET Status = @Status, EmployerNote = @Note WHERE Id = @Id";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Status", status);
                    command.Parameters.AddWithValue("@Note", (object)note ?? DBNull.Value);
                    command.Parameters.AddWithValue("@Id", applicationId);
                    int result = await command.ExecuteNonQueryAsync();
                    return result > 0;
                }
            }
        }

        public async Task<bool> CheckIfAppliedAsync(Guid userId, Guid jobPostId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                Guid candidateId = await GetCandidateIdByUserIdAsync(userId, connection);
                if (candidateId == Guid.Empty) return false;

                string query = "SELECT COUNT(1) FROM Applications WHERE CandidateId = @CandidateId AND JobPostId = @JobPostId";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CandidateId", candidateId);
                    command.Parameters.AddWithValue("@JobPostId", jobPostId);
                    var count = (int)await command.ExecuteScalarAsync();
                    return count > 0;
                }
            }
        }

        public async Task<bool> WithdrawApplicationAsync(Guid applicationId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                // Only allow withdrawing if the status is Pending
                string query = "DELETE FROM Applications WHERE Id = @Id AND Status = 'Pending'";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", applicationId);
                    int result = await command.ExecuteNonQueryAsync();
                    return result > 0;
                }
            }
        }

        public async Task<List<JobApplication>> GetApplicationsByCompanyIdAsync(Guid companyId)
        {
            var applications = new List<JobApplication>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                string query = @"
                    SELECT a.*, jp.Title as JobTitle, cand.FullName as CandidateName, cand.Avatar as CandidateAvatar, cand.UserId as CandidateUserId, cv.Title as CVTitle, cv.FileUrl as CVFileUrl
                    FROM Applications a
                    INNER JOIN JobPosts jp ON a.JobPostId = jp.Id
                    INNER JOIN Candidates cand ON a.CandidateId = cand.Id
                    LEFT JOIN CVs cv ON a.CVId = cv.Id
                    WHERE jp.CompanyId = @CompanyId
                    ORDER BY a.ApplyDate DESC";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@CompanyId", companyId);
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            applications.Add(new JobApplication
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                CandidateId = reader.GetGuid(reader.GetOrdinal("CandidateId")),
                                JobPostId = reader.GetGuid(reader.GetOrdinal("JobPostId")),
                                CVId = reader.GetGuid(reader.GetOrdinal("CVId")),
                                ApplyDate = reader.GetDateTime(reader.GetOrdinal("ApplyDate")),
                                CoverLetter = reader.IsDBNull(reader.GetOrdinal("CoverLetter")) ? null : reader.GetString(reader.GetOrdinal("CoverLetter")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                CVType = reader.IsDBNull(reader.GetOrdinal("CVType")) ? "Online" : reader.GetString(reader.GetOrdinal("CVType")),
                                EmployerNote = reader.IsDBNull(reader.GetOrdinal("EmployerNote")) ? null : reader.GetString(reader.GetOrdinal("EmployerNote")),
                                JobTitle = reader.GetString(reader.GetOrdinal("JobTitle")),
                                CandidateName = reader.GetString(reader.GetOrdinal("CandidateName")),
                                CandidateAvatar = reader.IsDBNull(reader.GetOrdinal("CandidateAvatar")) ? null : reader.GetString(reader.GetOrdinal("CandidateAvatar")),
                                CVTitle = reader.IsDBNull(reader.GetOrdinal("CVTitle")) ? "Online CV" : reader.GetString(reader.GetOrdinal("CVTitle")),
                                CVFileUrl = reader.IsDBNull(reader.GetOrdinal("CVFileUrl")) ? null : reader.GetString(reader.GetOrdinal("CVFileUrl")),
                                CandidateUserId = reader.IsDBNull(reader.GetOrdinal("CandidateUserId")) ? (Guid?)null : reader.GetGuid(reader.GetOrdinal("CandidateUserId"))
                            });
                        }
                    }
                }
            }
            return applications;
        }
    }
}
