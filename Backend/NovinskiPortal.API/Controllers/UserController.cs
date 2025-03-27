using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovinskiPortal.API.DTOs.User;
using NovinskiPortal.API.Models;
using NovinskiPortal.API.Services.PasswordService;

namespace NovinskiPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;
        private readonly IMapper _mapper;
        private readonly IPasswordService _passwordService;

        public UserController(DatabaseContext databaseContext, IMapper mapper, IPasswordService passwordService)
        {
            _databaseContext = databaseContext;
            _mapper = mapper;
            _passwordService = passwordService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserByIdAsync(int id)
        {
            var user = await _databaseContext.Users.FirstOrDefaultAsync(u => u.Id == id);
            return Ok(user);
        }


        [HttpGet]
        public async Task<IEnumerable<GetUsersResponseDto>> GetUsersAsync()
        {
            var users = await _databaseContext.Users.ToListAsync();
            var mappedUsers = _mapper.Map<IEnumerable<GetUsersResponseDto>>(users);

            return mappedUsers;
        }

        [HttpPost]
        public async Task<User> CreateUserRequestAsync([FromBody] CreateUserRequestDto createUserRequestDto)
        {
            var newUser = _mapper.Map<User>(createUserRequestDto);
            newUser.PasswordSalt = _passwordService.GenerateSalt();
            newUser.PasswordHash = _passwordService.HashPassword(createUserRequestDto.Password, newUser.PasswordSalt);

            await _databaseContext.AddAsync(newUser);
            await _databaseContext.SaveChangesAsync();

            return newUser;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserAsync(int id, [FromBody] UpdateUserRequestDto updateUserRequestDto)
        {
            var user = await _databaseContext.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound();

            user = _mapper.Map(updateUserRequestDto, user);
            user.PasswordSalt = _passwordService.GenerateSalt();
            user.PasswordHash = _passwordService.HashPassword(updateUserRequestDto.Password, user.PasswordSalt);

            _databaseContext.Update(user);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAsnc(int id)
        {
            var user = await _databaseContext.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound();

            _databaseContext.Remove(user);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateUserStatusAsync(int id, UpdateUserStatusRequestDto updateUserStatusRequestDto)
        {
            var user = await _databaseContext.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return NotFound();

            user.Active = updateUserStatusRequestDto.Active;

            _databaseContext.Update(user);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
