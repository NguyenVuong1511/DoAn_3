using System.Data;
using Microsoft.Data.SqlClient;
using TuyenDung_TimViec.Models;

namespace TuyenDung_TimViec.Repositories
{
    public interface ICVRepository
    {
        Task<CVDetail?> GetCVDetailByUserIdAsync(Guid userId);
        Task<bool> UpdateCVDetailAsync(Guid userId, CVDetail cv);
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

                // 1. Get the Candidate Info and their default/latest CV
                string queryCV = @"
                    SELECT TOP 1 
                           c.Id as CandidateId, c.FullName, c.Gender, c.Phone, c.Address, c.DateOfBirth, c.Avatar, c.AboutMe, c.Github, c.LinkedIn, c.Website,
                           u.Email,
                           cv.Id as CVId, cv.Title, cv.Type, cv.FileUrl, cv.UploadDate, cv.IsDefault
                    FROM Candidates c
                    INNER JOIN Users u ON c.UserId = u.Id
                    LEFT JOIN CVs cv ON c.Id = cv.CandidateId
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
                                CandidateId = reader.GetGuid(reader.GetOrdinal("CandidateId")),
                                FullName = reader.IsDBNull(reader.GetOrdinal("FullName")) ? string.Empty : reader.GetString(reader.GetOrdinal("FullName")),
                                Gender = reader.IsDBNull(reader.GetOrdinal("Gender")) ? string.Empty : reader.GetString(reader.GetOrdinal("Gender")),
                                Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? string.Empty : reader.GetString(reader.GetOrdinal("Email")),
                                Phone = reader.IsDBNull(reader.GetOrdinal("Phone")) ? string.Empty : reader.GetString(reader.GetOrdinal("Phone")),
                                Address = reader.IsDBNull(reader.GetOrdinal("Address")) ? string.Empty : reader.GetString(reader.GetOrdinal("Address")),
                                DateOfBirth = reader.IsDBNull(reader.GetOrdinal("DateOfBirth")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("DateOfBirth")),
                                Avatar = reader.IsDBNull(reader.GetOrdinal("Avatar")) ? string.Empty : reader.GetString(reader.GetOrdinal("Avatar")),
                                AboutMe = reader.IsDBNull(reader.GetOrdinal("AboutMe")) ? string.Empty : reader.GetString(reader.GetOrdinal("AboutMe")),
                                Github = reader.IsDBNull(reader.GetOrdinal("Github")) ? string.Empty : reader.GetString(reader.GetOrdinal("Github")),
                                LinkedIn = reader.IsDBNull(reader.GetOrdinal("LinkedIn")) ? string.Empty : reader.GetString(reader.GetOrdinal("LinkedIn")),
                                Website = reader.IsDBNull(reader.GetOrdinal("Website")) ? string.Empty : reader.GetString(reader.GetOrdinal("Website"))
                            };

                            // Map CV info if exists
                            if (!reader.IsDBNull(reader.GetOrdinal("CVId")))
                            {
                                cv.Id = reader.GetGuid(reader.GetOrdinal("CVId"));
                                cv.Title = reader.IsDBNull(reader.GetOrdinal("Title")) ? string.Empty : reader.GetString(reader.GetOrdinal("Title"));
                                cv.Type = reader.IsDBNull(reader.GetOrdinal("Type")) ? string.Empty : reader.GetString(reader.GetOrdinal("Type"));
                                cv.FileUrl = reader.IsDBNull(reader.GetOrdinal("FileUrl")) ? string.Empty : reader.GetString(reader.GetOrdinal("FileUrl"));
                                cv.UploadDate = reader.IsDBNull(reader.GetOrdinal("UploadDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("UploadDate"));
                                cv.IsDefault = reader.IsDBNull(reader.GetOrdinal("IsDefault")) ? false : reader.GetBoolean(reader.GetOrdinal("IsDefault"));
                            }
                            else
                            {
                                cv.Id = Guid.Empty;
                            }
                        }
                    }
                }

                if (cv == null) return null;

                // Only fetch child records if CVId is not empty
                if (cv.Id != Guid.Empty)
                {

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
                } // end if cv.Id != Guid.Empty
            }

            return cv;
        }

        public async Task<bool> UpdateCVDetailAsync(Guid userId, CVDetail cv)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (SqlTransaction transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // 1. Update Candidate Info
                        string queryCandidate = @"
                            UPDATE Candidates 
                            SET FullName = @FullName, 
                                Phone = @Phone, 
                                Address = @Address, 
                                DateOfBirth = @DateOfBirth, 
                                AboutMe = @AboutMe, 
                                Github = @Github, 
                                LinkedIn = @LinkedIn, 
                                Website = @Website
                            WHERE UserId = @UserId";
                        
                        using (SqlCommand cmd = new SqlCommand(queryCandidate, connection, transaction))
                        {
                            cmd.Parameters.AddWithValue("@FullName", (object)cv.FullName ?? string.Empty);
                            cmd.Parameters.AddWithValue("@Phone", (object)cv.Phone ?? string.Empty);
                            cmd.Parameters.AddWithValue("@Address", (object)cv.Address ?? string.Empty);
                            cmd.Parameters.AddWithValue("@DateOfBirth", (object)cv.DateOfBirth ?? DBNull.Value);
                            cmd.Parameters.AddWithValue("@AboutMe", (object)cv.AboutMe ?? string.Empty);
                            cmd.Parameters.AddWithValue("@Github", (object)cv.Github ?? string.Empty);
                            cmd.Parameters.AddWithValue("@LinkedIn", (object)cv.LinkedIn ?? string.Empty);
                            cmd.Parameters.AddWithValue("@Website", (object)cv.Website ?? string.Empty);
                            cmd.Parameters.AddWithValue("@UserId", userId);

                            await cmd.ExecuteNonQueryAsync();
                        }

                        // 2. Ensure CV exists and update Title/Type
                        Guid currentCvId = cv.Id;
                        if (currentCvId == Guid.Empty)
                        {
                            currentCvId = Guid.NewGuid();
                            cv.Id = currentCvId; // update reference
                            
                            // Get CandidateId for insertion
                            string queryCandidateId = "SELECT Id FROM Candidates WHERE UserId = @UserId";
                            Guid candidateId = Guid.Empty;
                            using (SqlCommand cmdCandidateId = new SqlCommand(queryCandidateId, connection, transaction))
                            {
                                cmdCandidateId.Parameters.AddWithValue("@UserId", userId);
                                var result = await cmdCandidateId.ExecuteScalarAsync();
                                if (result != null) candidateId = (Guid)result;
                            }

                            if (candidateId != Guid.Empty) {
                                string insertCv = @"
                                    INSERT INTO CVs (Id, CandidateId, Title, Type, FileUrl, UploadDate, IsDefault)
                                    VALUES (@Id, @CandidateId, @Title, @Type, @FileUrl, @UploadDate, @IsDefault)";
                                using (SqlCommand cmdInsertCv = new SqlCommand(insertCv, connection, transaction))
                                {
                                    cmdInsertCv.Parameters.AddWithValue("@Id", currentCvId);
                                    cmdInsertCv.Parameters.AddWithValue("@CandidateId", candidateId);
                                    cmdInsertCv.Parameters.AddWithValue("@Title", (object)cv.Title ?? string.Empty);
                                    cmdInsertCv.Parameters.AddWithValue("@Type", "ONLINE");
                                    cmdInsertCv.Parameters.AddWithValue("@FileUrl", string.Empty);
                                    cmdInsertCv.Parameters.AddWithValue("@UploadDate", DateTime.Now);
                                    cmdInsertCv.Parameters.AddWithValue("@IsDefault", true);
                                    await cmdInsertCv.ExecuteNonQueryAsync();
                                }
                            }
                        }
                        else
                        {
                            string updateCv = "UPDATE CVs SET Title = @Title WHERE Id = @Id";
                            using (SqlCommand cmdUpdateCv = new SqlCommand(updateCv, connection, transaction))
                            {
                                cmdUpdateCv.Parameters.AddWithValue("@Title", (object)cv.Title ?? string.Empty);
                                cmdUpdateCv.Parameters.AddWithValue("@Id", currentCvId);
                                await cmdUpdateCv.ExecuteNonQueryAsync();
                            }
                        }

                        if (currentCvId != Guid.Empty)
                        {
                            // 3. Update Educations (Delete & Insert)
                            string deleteEdu = "DELETE FROM CVEducations WHERE CVId = @CVId";
                            using (SqlCommand cmdDel = new SqlCommand(deleteEdu, connection, transaction))
                            {
                                cmdDel.Parameters.AddWithValue("@CVId", currentCvId);
                                await cmdDel.ExecuteNonQueryAsync();
                            }

                            if (cv.Educations != null && cv.Educations.Count > 0)
                            {
                                foreach (var edu in cv.Educations)
                                {
                                    string insertEdu = @"
                                        INSERT INTO CVEducations (Id, CVId, SchoolName, Major, StartDate, EndDate, Description)
                                        VALUES (@Id, @CVId, @SchoolName, @Major, @StartDate, @EndDate, @Description)";
                                    using (SqlCommand cmdInsert = new SqlCommand(insertEdu, connection, transaction))
                                    {
                                        cmdInsert.Parameters.AddWithValue("@Id", Guid.NewGuid());
                                        cmdInsert.Parameters.AddWithValue("@CVId", currentCvId);
                                        cmdInsert.Parameters.AddWithValue("@SchoolName", (object)edu.SchoolName ?? string.Empty);
                                        cmdInsert.Parameters.AddWithValue("@Major", (object)edu.Major ?? string.Empty);
                                        cmdInsert.Parameters.AddWithValue("@StartDate", (object)edu.StartDate ?? DBNull.Value);
                                        cmdInsert.Parameters.AddWithValue("@EndDate", (object)edu.EndDate ?? DBNull.Value);
                                        cmdInsert.Parameters.AddWithValue("@Description", (object)edu.Description ?? string.Empty);
                                        await cmdInsert.ExecuteNonQueryAsync();
                                    }
                                }
                            }

                            // 4. Update Experiences (Delete & Insert)
                            string deleteExp = "DELETE FROM CVExperiences WHERE CVId = @CVId";
                            using (SqlCommand cmdDel = new SqlCommand(deleteExp, connection, transaction))
                            {
                                cmdDel.Parameters.AddWithValue("@CVId", currentCvId);
                                await cmdDel.ExecuteNonQueryAsync();
                            }

                            if (cv.Experiences != null && cv.Experiences.Count > 0)
                            {
                                foreach (var exp in cv.Experiences)
                                {
                                    string insertExp = @"
                                        INSERT INTO CVExperiences (Id, CVId, CompanyName, Position, StartDate, EndDate, Description)
                                        VALUES (@Id, @CVId, @CompanyName, @Position, @StartDate, @EndDate, @Description)";
                                    using (SqlCommand cmdInsert = new SqlCommand(insertExp, connection, transaction))
                                    {
                                        cmdInsert.Parameters.AddWithValue("@Id", Guid.NewGuid());
                                        cmdInsert.Parameters.AddWithValue("@CVId", currentCvId);
                                        cmdInsert.Parameters.AddWithValue("@CompanyName", (object)exp.CompanyName ?? string.Empty);
                                        cmdInsert.Parameters.AddWithValue("@Position", (object)exp.Position ?? string.Empty);
                                        cmdInsert.Parameters.AddWithValue("@StartDate", (object)exp.StartDate ?? DBNull.Value);
                                        cmdInsert.Parameters.AddWithValue("@EndDate", (object)exp.EndDate ?? DBNull.Value);
                                        cmdInsert.Parameters.AddWithValue("@Description", (object)exp.Description ?? string.Empty);
                                        await cmdInsert.ExecuteNonQueryAsync();
                                    }
                                }
                            }

                            // 5. Update Skills (Delete & Insert)
                            string deleteSkill = "DELETE FROM CVSkills WHERE CVId = @CVId";
                            using (SqlCommand cmdDel = new SqlCommand(deleteSkill, connection, transaction))
                            {
                                cmdDel.Parameters.AddWithValue("@CVId", currentCvId);
                                await cmdDel.ExecuteNonQueryAsync();
                            }

                            if (cv.Skills != null && cv.Skills.Count > 0)
                            {
                                foreach (var skill in cv.Skills)
                                {
                                    string insertSkill = @"
                                        INSERT INTO CVSkills (Id, CVId, SkillName, Level)
                                        VALUES (@Id, @CVId, @SkillName, @Level)";
                                    using (SqlCommand cmdInsert = new SqlCommand(insertSkill, connection, transaction))
                                    {
                                        cmdInsert.Parameters.AddWithValue("@Id", Guid.NewGuid());
                                        cmdInsert.Parameters.AddWithValue("@CVId", currentCvId);
                                        cmdInsert.Parameters.AddWithValue("@SkillName", (object)skill.SkillName ?? string.Empty);
                                        cmdInsert.Parameters.AddWithValue("@Level", (object)skill.Level ?? string.Empty);
                                        await cmdInsert.ExecuteNonQueryAsync();
                                    }
                                }
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }
    }
}
