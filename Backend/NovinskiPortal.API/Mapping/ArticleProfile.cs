using AutoMapper;
using NovinskiPortal.API.DTOs.Article;
using NovinskiPortal.API.Models;

namespace NovinskiPortal.API.Mapping
{
    public class ArticleProfile: Profile
    {
        public ArticleProfile()
        {
            CreateMap<CreateArticleRequestDto, Article>();
            CreateMap<UpdateArticleRequestDto, Article>();
            CreateMap<Article, GetArticleByIdResponseDto>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Category.Color))
                .ForMember(dest => dest.Subcategory, opt => opt.MapFrom(src => src.Subcategory.Name))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.HideFullName ? src.User.Nick : src.User.FirstName + ' ' + src.User.LastName))
                .ForMember(dest => dest.AdditionalPhotos, opt => opt.MapFrom(src => src.ArticlePhotos.Select(ap => ap.PhotoPath)));
            CreateMap<Article, GetArticlesItemResponseDto>()
                .ForMember(dest => dest.Category, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.Color, opt => opt.MapFrom(src => src.Category.Color))
                .ForMember(dest => dest.Subcategory, opt => opt.MapFrom(src => src.Subcategory.Name))
                .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User.FirstName + ' ' + src.User.LastName));


        }
    }
}
