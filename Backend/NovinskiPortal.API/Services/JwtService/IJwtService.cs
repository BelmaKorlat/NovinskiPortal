using NovinskiPortal.API.Models;

namespace NovinskiPortal.API.Services.JwtService
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
