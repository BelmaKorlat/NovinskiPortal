using AutoMapper;
using NovinskiPortal.API.DTOs.Category;
using NovinskiPortal.API.Models;

namespace NovinskiPortal.API.Mapping
{
    public class CategoryProfile: Profile
    {
        public CategoryProfile()
        {
            CreateMap<CreateCategoryRequestDto, Category>();
            CreateMap<UpdateCategoryRequestDto, Category>();
        }
    }
}
