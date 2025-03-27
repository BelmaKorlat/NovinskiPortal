namespace NovinskiPortal.API.DTOs.User
{
    public class UpdateUserRequestDto
    {
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string Nick { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
        public int Role { get; set; }
        public bool Active { get; set; }
    }
}
