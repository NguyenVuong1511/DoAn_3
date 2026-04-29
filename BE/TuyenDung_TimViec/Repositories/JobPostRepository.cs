using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface IJobPostRepository
    {
        Task<List<JobPost>> GetTopJobPostsAsync(int count);
        Task<(List<JobPost> Jobs, int TotalCount)> GetPagedJobPostsAsync(
            int pageNumber, 
            int pageSize, 
            string title = null, 
            Guid? categoryId = null, 
            Guid? locationId = null, 
            Guid? jobTypeId = null, 
            Guid? levelId = null, 
            Guid? experienceId = null, 
            decimal? minSalary = null, 
            decimal? maxSalary = null);
    }

    public class JobPostRepository : IJobPostRepository
    {
        private readonly string _connectionString;

        public JobPostRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<JobPost>> GetTopJobPostsAsync(int count)
        {
            var jobPosts = new List<JobPost>();
            string query = @"
                SELECT TOP (@count) jp.*, c.Name as CompanyName, c.Logo as CompanyLogo, l.Name as LocationName, jt.Name as JobTypeName
                FROM JobPosts jp
                LEFT JOIN Companies c ON jp.CompanyId = c.Id
                LEFT JOIN Locations l ON jp.LocationId = l.Id
                LEFT JOIN JobTypes jt ON jp.JobTypeId = jt.Id
                ORDER BY jp.PostDate DESC";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@count", count);
                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            jobPosts.Add(MapJobPost(reader));
                        }
                    }
                }
            }
            return jobPosts;
        }

        public async Task<(List<JobPost> Jobs, int TotalCount)> GetPagedJobPostsAsync(
            int pageNumber, 
            int pageSize, 
            string title = null, 
            Guid? categoryId = null, 
            Guid? locationId = null, 
            Guid? jobTypeId = null, 
            Guid? levelId = null, 
            Guid? experienceId = null, 
            decimal? minSalary = null, 
            decimal? maxSalary = null)
        {
            var jobPosts = new List<JobPost>();
            int totalCount = 0;
            int offset = (pageNumber - 1) * pageSize;

            var whereClauses = new List<string>();
            var parameters = new List<SqlParameter>();

            if (!string.IsNullOrEmpty(title))
            {
                whereClauses.Add("jp.Title LIKE @title");
                parameters.Add(new SqlParameter("@title", $"%{title}%"));
            }

            if (categoryId.HasValue && categoryId != Guid.Empty)
            {
                whereClauses.Add("jp.CategoryId = @categoryId");
                parameters.Add(new SqlParameter("@categoryId", categoryId.Value));
            }

            if (locationId.HasValue && locationId != Guid.Empty)
            {
                whereClauses.Add("jp.LocationId = @locationId");
                parameters.Add(new SqlParameter("@locationId", locationId.Value));
            }

            if (jobTypeId.HasValue && jobTypeId != Guid.Empty)
            {
                whereClauses.Add("jp.JobTypeId = @jobTypeId");
                parameters.Add(new SqlParameter("@jobTypeId", jobTypeId.Value));
            }

            if (levelId.HasValue && levelId != Guid.Empty)
            {
                whereClauses.Add("jp.LevelId = @levelId");
                parameters.Add(new SqlParameter("@levelId", levelId.Value));
            }

            if (experienceId.HasValue && experienceId != Guid.Empty)
            {
                whereClauses.Add("jp.ExperienceId = @experienceId");
                parameters.Add(new SqlParameter("@experienceId", experienceId.Value));
            }

            if (minSalary.HasValue)
            {
                whereClauses.Add("jp.MaxSalary >= @minSalary");
                parameters.Add(new SqlParameter("@minSalary", minSalary.Value));
            }

            if (maxSalary.HasValue)
            {
                whereClauses.Add("jp.MinSalary <= @maxSalary");
                parameters.Add(new SqlParameter("@maxSalary", maxSalary.Value));
            }

            string whereSql = whereClauses.Count > 0 ? "WHERE " + string.Join(" AND ", whereClauses) : "";

            string query = $@"
                SELECT jp.*, c.Name as CompanyName, c.Logo as CompanyLogo, l.Name as LocationName, jt.Name as JobTypeName
                FROM JobPosts jp
                LEFT JOIN Companies c ON jp.CompanyId = c.Id
                LEFT JOIN Locations l ON jp.LocationId = l.Id
                LEFT JOIN JobTypes jt ON jp.JobTypeId = jt.Id
                {whereSql}
                ORDER BY jp.PostDate DESC
                OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;

                SELECT COUNT(*) FROM JobPosts jp {whereSql};";

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@offset", offset);
                    command.Parameters.AddWithValue("@pageSize", pageSize);
                    foreach (var param in parameters)
                    {
                        command.Parameters.Add(new SqlParameter(param.ParameterName, param.Value));
                    }

                    await connection.OpenAsync();
                    using (SqlDataReader reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            jobPosts.Add(MapJobPost(reader));
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

        private JobPost MapJobPost(SqlDataReader reader)
        {
            return new JobPost
            {
                Id = reader.IsDBNull(reader.GetOrdinal("Id")) ? Guid.Empty : reader.GetGuid(reader.GetOrdinal("Id")),
                RecruiterId = reader.IsDBNull(reader.GetOrdinal("RecruiterId")) ? Guid.Empty : reader.GetGuid(reader.GetOrdinal("RecruiterId")),
                CompanyId = reader.IsDBNull(reader.GetOrdinal("CompanyId")) ? Guid.Empty : reader.GetGuid(reader.GetOrdinal("CompanyId")),
                CategoryId = reader.IsDBNull(reader.GetOrdinal("CategoryId")) ? Guid.Empty : reader.GetGuid(reader.GetOrdinal("CategoryId")),
                LocationId = reader.IsDBNull(reader.GetOrdinal("LocationId")) ? Guid.Empty : reader.GetGuid(reader.GetOrdinal("LocationId")),
                JobTypeId = reader.IsDBNull(reader.GetOrdinal("JobTypeId")) ? Guid.Empty : reader.GetGuid(reader.GetOrdinal("JobTypeId")),
                LevelId = reader.IsDBNull(reader.GetOrdinal("LevelId")) ? Guid.Empty : reader.GetGuid(reader.GetOrdinal("LevelId")),
                ExperienceId = reader.IsDBNull(reader.GetOrdinal("ExperienceId")) ? Guid.Empty : reader.GetGuid(reader.GetOrdinal("ExperienceId")),
                Title = reader.IsDBNull(reader.GetOrdinal("Title")) ? string.Empty : reader.GetString(reader.GetOrdinal("Title")),
                MinSalary = reader.IsDBNull(reader.GetOrdinal("MinSalary")) ? 0 : reader.GetDecimal(reader.GetOrdinal("MinSalary")),
                MaxSalary = reader.IsDBNull(reader.GetOrdinal("MaxSalary")) ? 0 : reader.GetDecimal(reader.GetOrdinal("MaxSalary")),
                PostDate = reader.IsDBNull(reader.GetOrdinal("PostDate")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("PostDate")),
                Deadline = reader.IsDBNull(reader.GetOrdinal("Deadline")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("Deadline")),
                Status = reader.IsDBNull(reader.GetOrdinal("Status")) ? string.Empty : reader.GetString(reader.GetOrdinal("Status")),
                CompanyName = reader.IsDBNull(reader.GetOrdinal("CompanyName")) ? string.Empty : reader.GetString(reader.GetOrdinal("CompanyName")),
                CompanyLogo = reader.IsDBNull(reader.GetOrdinal("CompanyLogo")) ? string.Empty : reader.GetString(reader.GetOrdinal("CompanyLogo")),
                LocationName = reader.IsDBNull(reader.GetOrdinal("LocationName")) ? string.Empty : reader.GetString(reader.GetOrdinal("LocationName")),
                JobTypeName = reader.IsDBNull(reader.GetOrdinal("JobTypeName")) ? string.Empty : reader.GetString(reader.GetOrdinal("JobTypeName"))
            };
        }
    }
}
