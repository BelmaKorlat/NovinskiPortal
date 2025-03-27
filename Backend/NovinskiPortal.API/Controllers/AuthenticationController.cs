using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovinskiPortal.API.DTOs.Authentication;
using NovinskiPortal.API.Services.JwtService;
using NovinskiPortal.API.Services.PasswordService;

namespace NovinskiPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;
        private readonly IPasswordService _passwordService;
        private readonly IJwtService _jwtService;

        public AuthenticationController(DatabaseContext databaseContext, IPasswordService passwordService, IJwtService jwtService)
        {
            _databaseContext = databaseContext;
            _passwordService = passwordService;
            _jwtService = jwtService;
        }
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequestDto loginRequestDto)
        {
            var user = await _databaseContext.Users.FirstOrDefaultAsync(u => u.Email == loginRequestDto.EmailOrUsername || u.Username == loginRequestDto.EmailOrUsername);

            if (user == null)
                return Unauthorized();

            var isValid = _passwordService.VerifyPassword(loginRequestDto.Password, user.PasswordSalt, user.PasswordHash);

            if (!isValid)
                return Unauthorized();

            var token = _jwtService.GenerateToken(user);

            var loginResponseDto = new LoginResponseDto
            {
                Message = "Login successful!",
                Token = token
            };

            return Ok(loginResponseDto);

        }

    }
}
