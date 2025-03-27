using AutoMapper;
using NovinskiPortal.API.Models;
using NovinskiPortal.API.DTOs.User;
namespace NovinskiPortal.API.Mapping
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<CreateUserRequestDto, User>();
            CreateMap<UpdateUserRequestDto, User>();
            CreateMap<User, GetUsersResponseDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FirstName + ' ' + src.LastName));
        }
    }
}
