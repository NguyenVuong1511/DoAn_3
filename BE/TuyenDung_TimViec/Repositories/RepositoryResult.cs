namespace TuyenDung_TimViec.Repositories
{
    public class RepositoryResult<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }

        // Optional: Helper methods to make returning results cleaner
        public static RepositoryResult<T> Ok(T data, string message = null)
            => new RepositoryResult<T> { Success = true, Data = data, Message = message };

        public static RepositoryResult<T> Fail(string message)
            => new RepositoryResult<T> { Success = false, Message = message };
    }
}
