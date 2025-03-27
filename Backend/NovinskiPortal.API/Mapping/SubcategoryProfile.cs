using AutoMapper;
using NovinskiPortal.API.DTOs.Subcategory;
using NovinskiPortal.API.Models;

namespace NovinskiPortal.API.Mapping
{
    public class SubcategoryProfile: Profile
    {
        public SubcategoryProfile()
        {
            CreateMap<CreateSubcategoryRequestDto, Subcategory>();
            CreateMap<UpdateSubcategoryRequestDto, Subcategory>();
            CreateMap<Subcategory, GetSubcategoryResponseDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));
        }
    }
}
