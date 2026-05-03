using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace TuyenDung_TimViec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly string _connectionString;
        private readonly IWebHostEnvironment _env;

        public UploadController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _env = env;
        }

        [HttpPost("avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file, [FromForm] Guid userId)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Không có file được chọn." });

            try
            {
                // Construct path to FE/TuyenDung_TimViecLam/public/images/avatar
                var beDir = _env.ContentRootPath;
                var feAvatarDir = Path.GetFullPath(Path.Combine(beDir, "..", "..", "FE", "TuyenDung_TimViecLam", "public", "images", "avatar"));

                if (!Directory.Exists(feAvatarDir))
                {
                    Directory.CreateDirectory(feAvatarDir);
                }

                // Create a unique filename
                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"avatar_{userId}_{DateTime.Now.Ticks}{fileExtension}";
                var filePath = Path.Combine(feAvatarDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Update Candidates table in DB and delete old file
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    
                    // 1. Get old avatar to delete
                    string oldAvatar = null;
                    var selectQuery = "SELECT Avatar FROM Candidates WHERE UserId = @UserId";
                    using (SqlCommand selectCmd = new SqlCommand(selectQuery, conn))
                    {
                        selectCmd.Parameters.AddWithValue("@UserId", userId);
                        var result = await selectCmd.ExecuteScalarAsync();
                        if (result != null && result != DBNull.Value)
                        {
                            oldAvatar = result.ToString();
                        }
                    }

                    // 2. Delete old avatar if it exists
                    if (!string.IsNullOrEmpty(oldAvatar))
                    {
                        var oldFilePath = Path.Combine(feAvatarDir, oldAvatar);
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            try
                            {
                                System.IO.File.Delete(oldFilePath);
                            }
                            catch (Exception)
                            {
                                // Ignore if cannot delete to avoid breaking the upload process
                            }
                        }
                    }

                    // 3. Update DB with new avatar
                    var updateQuery = "UPDATE Candidates SET Avatar = @Avatar WHERE UserId = @UserId";
                    using (SqlCommand updateCmd = new SqlCommand(updateQuery, conn))
                    {
                        updateCmd.Parameters.AddWithValue("@Avatar", fileName);
                        updateCmd.Parameters.AddWithValue("@UserId", userId);
                        int rowsAffected = await updateCmd.ExecuteNonQueryAsync();

                        if (rowsAffected == 0)
                        {
                            return NotFound(new { success = false, message = "Không tìm thấy hồ sơ ứng viên để cập nhật." });
                        }
                    }
                }

                return Ok(new { success = true, message = "Tải ảnh thành công.", data = fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lưu ảnh: " + ex.Message });
            }
        }

        [HttpPost("cvfile")]
        public async Task<IActionResult> UploadCVFile([FromForm] IFormFile file, [FromForm] Guid userId)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Không có file được chọn." });

            try
            {
                // Construct path to FE/TuyenDung_TimViecLam/public/cvs
                var beDir = _env.ContentRootPath;
                var feCvDir = Path.GetFullPath(Path.Combine(beDir, "..", "..", "FE", "TuyenDung_TimViecLam", "public", "cvs"));

                if (!Directory.Exists(feCvDir))
                {
                    Directory.CreateDirectory(feCvDir);
                }

                // Create a unique filename
                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"CV_{userId}_{DateTime.Now.Ticks}{fileExtension}";
                var filePath = Path.Combine(feCvDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Update CVs table in DB and delete old file
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();
                    
                    // 1. Find the CandidateId first
                    Guid candidateId = Guid.Empty;
                    using (SqlCommand findCmd = new SqlCommand("SELECT Id FROM Candidates WHERE UserId = @UserId", conn))
                    {
                        findCmd.Parameters.AddWithValue("@UserId", userId);
                        var result = await findCmd.ExecuteScalarAsync();
                        if (result != null) candidateId = (Guid)result;
                    }

                    if (candidateId != Guid.Empty)
                    {
                        // 2. Get old file to delete
                        string oldFile = null;
                        using (SqlCommand selectCmd = new SqlCommand("SELECT FileUrl FROM CVs WHERE CandidateId = @CandidateId AND IsDefault = 1", conn))
                        {
                            selectCmd.Parameters.AddWithValue("@CandidateId", candidateId);
                            var result = await selectCmd.ExecuteScalarAsync();
                            if (result != null && result != DBNull.Value) oldFile = result.ToString();
                        }

                        // 3. Update DB
                        var updateQuery = "UPDATE CVs SET FileUrl = @FileUrl, UploadDate = @UploadDate WHERE CandidateId = @CandidateId AND IsDefault = 1";
                        using (SqlCommand updateCmd = new SqlCommand(updateQuery, conn))
                        {
                            updateCmd.Parameters.AddWithValue("@FileUrl", fileName);
                            updateCmd.Parameters.AddWithValue("@UploadDate", DateTime.Now);
                            updateCmd.Parameters.AddWithValue("@CandidateId", candidateId);
                            int rowsAffected = await updateCmd.ExecuteNonQueryAsync();

                            if (rowsAffected == 0)
                            {
                                // If no default CV, insert one
                                var insertQuery = "INSERT INTO CVs (Id, CandidateId, FileUrl, UploadDate, IsDefault, Title, Type) VALUES (@Id, @CandidateId, @FileUrl, @UploadDate, 1, @Title, @Type)";
                                using (SqlCommand insertCmd = new SqlCommand(insertQuery, conn))
                                {
                                    insertCmd.Parameters.AddWithValue("@Id", Guid.NewGuid());
                                    insertCmd.Parameters.AddWithValue("@CandidateId", candidateId);
                                    insertCmd.Parameters.AddWithValue("@FileUrl", fileName);
                                    insertCmd.Parameters.AddWithValue("@UploadDate", DateTime.Now);
                                    insertCmd.Parameters.AddWithValue("@Title", "Default CV");
                                    insertCmd.Parameters.AddWithValue("@Type", "Uploaded");
                                    await insertCmd.ExecuteNonQueryAsync();
                                }
                            }
                        }

                        // 4. Delete old file
                        if (!string.IsNullOrEmpty(oldFile))
                        {
                            var oldFilePath = Path.Combine(feCvDir, oldFile);
                            if (System.IO.File.Exists(oldFilePath))
                            {
                                try { System.IO.File.Delete(oldFilePath); } catch { }
                            }
                        }
                    }
                }

                return Ok(new { success = true, message = "Tải CV thành công.", data = fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lưu file: " + ex.Message });
            }
        }

        [HttpDelete("cvfile/{userId}")]
        public async Task<IActionResult> DeleteCVFile(Guid userId)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    // 1. Find the CandidateId
                    Guid candidateId = Guid.Empty;
                    using (SqlCommand findCmd = new SqlCommand("SELECT Id FROM Candidates WHERE UserId = @UserId", conn))
                    {
                        findCmd.Parameters.AddWithValue("@UserId", userId);
                        var result = await findCmd.ExecuteScalarAsync();
                        if (result != null) candidateId = (Guid)result;
                    }

                    if (candidateId == Guid.Empty)
                        return NotFound(new { success = false, message = "Không tìm thấy ứng viên." });

                    // 2. Get the filename to delete from disk
                    string fileName = null;
                    using (SqlCommand selectCmd = new SqlCommand("SELECT FileUrl FROM CVs WHERE CandidateId = @CandidateId AND IsDefault = 1", conn))
                    {
                        selectCmd.Parameters.AddWithValue("@CandidateId", candidateId);
                        var result = await selectCmd.ExecuteScalarAsync();
                        if (result != null && result != DBNull.Value) fileName = result.ToString();
                    }

                    if (string.IsNullOrEmpty(fileName))
                        return BadRequest(new { success = false, message = "Không có file CV để xóa." });

                    // 3. Clear FileUrl in DB
                    using (SqlCommand updateCmd = new SqlCommand("UPDATE CVs SET FileUrl = NULL, UploadDate = NULL WHERE CandidateId = @CandidateId AND IsDefault = 1", conn))
                    {
                        updateCmd.Parameters.AddWithValue("@CandidateId", candidateId);
                        await updateCmd.ExecuteNonQueryAsync();
                    }

                    // 4. Delete file from disk
                    var beDir = _env.ContentRootPath;
                    var feCvDir = Path.GetFullPath(Path.Combine(beDir, "..", "..", "FE", "TuyenDung_TimViecLam", "public", "cvs"));
                    var filePath = Path.Combine(feCvDir, fileName);

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }

                return Ok(new { success = true, message = "Xóa CV thành công." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi xóa file: " + ex.Message });
            }
        }

        [HttpPost("company-logo")]
        public async Task<IActionResult> UploadCompanyLogo([FromForm] IFormFile file, [FromForm] Guid companyId)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Không có file được chọn." });

            try
            {
                var beDir = _env.ContentRootPath;
                var feImgDir = Path.GetFullPath(Path.Combine(beDir, "..", "..", "FE", "TuyenDung_TimViecLam", "public", "images"));

                if (!Directory.Exists(feImgDir)) Directory.CreateDirectory(feImgDir);

                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"logo_{companyId}_{DateTime.Now.Ticks}{fileExtension}";
                var filePath = Path.Combine(feImgDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    // Delete old logo
                    string oldLogo = null;
                    using (SqlCommand selectCmd = new SqlCommand("SELECT Logo FROM Companies WHERE Id = @CompanyId", conn))
                    {
                        selectCmd.Parameters.AddWithValue("@CompanyId", companyId);
                        var result = await selectCmd.ExecuteScalarAsync();
                        if (result != null && result != DBNull.Value) oldLogo = result.ToString();
                    }

                    if (!string.IsNullOrEmpty(oldLogo))
                    {
                        var oldFilePath = Path.Combine(feImgDir, oldLogo);
                        if (System.IO.File.Exists(oldFilePath)) try { System.IO.File.Delete(oldFilePath); } catch { }
                    }

                    // Update DB
                    using (SqlCommand updateCmd = new SqlCommand("UPDATE Companies SET Logo = @Logo WHERE Id = @CompanyId", conn))
                    {
                        updateCmd.Parameters.AddWithValue("@Logo", fileName);
                        updateCmd.Parameters.AddWithValue("@CompanyId", companyId);
                        await updateCmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok(new { success = true, message = "Tải logo thành công.", data = fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lưu logo: " + ex.Message });
            }
        }

        [HttpPost("company-cover")]
        public async Task<IActionResult> UploadCompanyCover([FromForm] IFormFile file, [FromForm] Guid companyId)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Không có file được chọn." });

            try
            {
                var beDir = _env.ContentRootPath;
                var feImgDir = Path.GetFullPath(Path.Combine(beDir, "..", "..", "FE", "TuyenDung_TimViecLam", "public", "images"));

                if (!Directory.Exists(feImgDir)) Directory.CreateDirectory(feImgDir);

                var fileExtension = Path.GetExtension(file.FileName);
                var fileName = $"cover_{companyId}_{DateTime.Now.Ticks}{fileExtension}";
                var filePath = Path.Combine(feImgDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                using (SqlConnection conn = new SqlConnection(_connectionString))
                {
                    await conn.OpenAsync();

                    // Delete old cover
                    string oldCover = null;
                    using (SqlCommand selectCmd = new SqlCommand("SELECT CoverImage FROM Companies WHERE Id = @CompanyId", conn))
                    {
                        selectCmd.Parameters.AddWithValue("@CompanyId", companyId);
                        var result = await selectCmd.ExecuteScalarAsync();
                        if (result != null && result != DBNull.Value) oldCover = result.ToString();
                    }

                    if (!string.IsNullOrEmpty(oldCover))
                    {
                        var oldFilePath = Path.Combine(feImgDir, oldCover);
                        if (System.IO.File.Exists(oldFilePath)) try { System.IO.File.Delete(oldFilePath); } catch { }
                    }

                    // Update DB
                    using (SqlCommand updateCmd = new SqlCommand("UPDATE Companies SET CoverImage = @CoverImage WHERE Id = @CompanyId", conn))
                    {
                        updateCmd.Parameters.AddWithValue("@CoverImage", fileName);
                        updateCmd.Parameters.AddWithValue("@CompanyId", companyId);
                        await updateCmd.ExecuteNonQueryAsync();
                    }
                }

                return Ok(new { success = true, message = "Tải ảnh bìa thành công.", data = fileName });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi khi lưu ảnh bìa: " + ex.Message });
            }
        }
    }
}
