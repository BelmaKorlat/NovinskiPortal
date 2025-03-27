namespace NovinskiPortal.API.DTOs.Authentication
{
    public class LoginResponseDto
    {
        public string Message { get; set; } = default!;
        public string Token { get; set; } = default!;
    }
}
