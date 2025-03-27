namespace NovinskiPortal.API.DTOs.Authentication
{
    public class LoginRequestDto
    {
        public string EmailOrUsername { get; set; } = default!;
        public string Password { get; set; } = default!;
    }
}
