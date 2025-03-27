using AutoMapper;
using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovinskiPortal.API.DTOs.Article;
using NovinskiPortal.API.DTOs.Subcategory;
using NovinskiPortal.API.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace NovinskiPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly DatabaseContext _databasecontext;
        private readonly IMapper _mapper;

        public ArticlesController(DatabaseContext databaseContext, IMapper mapper)
        {
            _databasecontext = databaseContext;
            _mapper = mapper;
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetArticleByIdAsync(int id)
        {
            var article = await _databasecontext.Articles.Include(a => a.Category)
                                                         .Include(a => a.Subcategory)
                                                         .Include(a => a.User)
                                                         .Include(a => a.ArticlePhotos)
                                                         .FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
                return NotFound();

            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";

            article.MainPhotoPath = $"{baseUrl}{article.MainPhotoPath}";

            foreach (var item in article.ArticlePhotos)
            {
                if (!string.IsNullOrEmpty(item.PhotoPath))
                {
                    item.PhotoPath = $"{baseUrl}{item.PhotoPath}";
                }
            }

            var articleDto = _mapper.Map<GetArticleByIdResponseDto>(article);
            
            return Ok(articleDto);
        }

        [HttpGet]
        public async Task<GetArticlesResponseDto> GetArticlesAsync([FromQuery] GetArticlesRequestDto getArticleRequestDto)
        {
            var query = _databasecontext.Articles.Include(c => c.Category).Include(s => s.Subcategory).Include(u => u.User).AsQueryable();

            if (!string.IsNullOrEmpty(getArticleRequestDto.Query))
            {
                query = query.Where(a =>
                a.Headline.Contains(getArticleRequestDto.Query) ||
                a.Subheadline.Contains(getArticleRequestDto.Query) ||
                a.Text.Contains(getArticleRequestDto.Query) ||
                a.ShortText.Contains(getArticleRequestDto.Query));
            }

            if (getArticleRequestDto.CategoryId != null)
            {
                query = query.Where(a => a.CategoryId == getArticleRequestDto.CategoryId);
            }

            if (getArticleRequestDto.SubcategoryId != null)
            {
                query = query.Where(a => a.SubcategoryId == getArticleRequestDto.SubcategoryId);
            }

            if(getArticleRequestDto.UserId != null)
            {
                query = query.Where(u => u.UserId == getArticleRequestDto.UserId);
            }

            query = query.OrderByDescending(a => a.PublishedAt);

            var items = await query
                .Skip((getArticleRequestDto.PageNumber - 1) * getArticleRequestDto.PageSize)
                .Take(getArticleRequestDto.PageSize)
                .ToListAsync();

            var request = HttpContext.Request;
            var baseUrl = $"{request.Scheme}://{request.Host}{request.PathBase}";

            foreach (var item in items)
            {
                if (!string.IsNullOrEmpty(item.MainPhotoPath))
                {
                    item.MainPhotoPath = $"{baseUrl}{item.MainPhotoPath}";
                }
            }

            var result = new GetArticlesResponseDto()
            {
                Items = _mapper.Map<IEnumerable<GetArticlesItemResponseDto>>(items),
                TotalCount = await query.CountAsync()
            };

            return result;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateArticleAsync([FromForm] CreateArticleRequestDto createArticleRequestDto)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var newArticle = _mapper.Map<Article>(createArticleRequestDto);
            newArticle.UserId = int.Parse(userId);
            newArticle.CreatedAt = DateTime.Now;
              
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Photos");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var mainPhotoFileExtension = Path.GetExtension(createArticleRequestDto.MainPhoto.FileName);
            var mainPhotoFileName = $"{Guid.NewGuid()}{mainPhotoFileExtension}";
            var mainPhotoPath = Path.Combine(uploadsFolder, mainPhotoFileName); 

            using (var stream = new FileStream(mainPhotoPath, FileMode.Create)) 
            {
                await createArticleRequestDto.MainPhoto.CopyToAsync(stream);
            }

            newArticle.MainPhotoPath = $"/Photos/{mainPhotoFileName}";

            await _databasecontext.Articles.AddAsync(newArticle);
            await _databasecontext.SaveChangesAsync();

            if (createArticleRequestDto.AdditionalPhotos != null && createArticleRequestDto.AdditionalPhotos.Any())
            {
                var articlePhotos = new List<ArticlePhoto>();

                foreach (var item in createArticleRequestDto.AdditionalPhotos)
                {
                    var newArticlePhoto = new ArticlePhoto();
                    newArticlePhoto.ArticleId = newArticle.Id;

                    var itemPhotoFileExtension = Path.GetExtension(item.FileName);
                    var itemPhotoFileName = $"{Guid.NewGuid()}{itemPhotoFileExtension}";
                    var itemPhotoPath = Path.Combine(uploadsFolder, itemPhotoFileName);

                    using (var stream = new FileStream(itemPhotoPath, FileMode.Create)) 
                    {
                        await item.CopyToAsync(stream);
                    }

                    newArticlePhoto.PhotoPath = $"/Photos/{itemPhotoFileName}";

                    articlePhotos.Add(newArticlePhoto);
                }

                await _databasecontext.ArticlePhotos.AddRangeAsync(articlePhotos);
                await _databasecontext.SaveChangesAsync();
            }
        
            return Ok(newArticle);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticleAsync(int id, [FromForm] UpdateArticleRequestDto updateArticleRequestDto)
        {
            var article = await _databasecontext.Articles.FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
                return NotFound();

            var userId = article.UserId;
            article = _mapper.Map(updateArticleRequestDto, article);
            article.UserId = userId;

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Photos");

            if (updateArticleRequestDto.MainPhoto != null)
            {
                var oldPhotoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", article.MainPhotoPath.TrimStart('/'));
                if (System.IO.File.Exists(oldPhotoPath))
                    System.IO.File.Delete(oldPhotoPath);

                var mainPhotoFileExtension = Path.GetExtension(updateArticleRequestDto.MainPhoto.FileName);
                var mainPhotoFileName = $"{Guid.NewGuid()}{mainPhotoFileExtension}";
                var mainPhotoPath = Path.Combine(uploadsFolder, mainPhotoFileName);

                using (var stream = new FileStream(mainPhotoPath, FileMode.Create))
                {
                    await updateArticleRequestDto.MainPhoto.CopyToAsync(stream);
                }

                article.MainPhotoPath = $"/Photos/{mainPhotoFileName}";
            }

            _databasecontext.Update(article);
            await _databasecontext.SaveChangesAsync();

            if (updateArticleRequestDto.AdditionalPhotos != null && updateArticleRequestDto.AdditionalPhotos.Any())
            {
                var articlePhotos = new List<ArticlePhoto>();

                foreach (var item in updateArticleRequestDto.AdditionalPhotos)
                {
                    var newArticlePhoto = new ArticlePhoto();
                    newArticlePhoto.ArticleId = article.Id;

                    var itemPhotoFileExtension = Path.GetExtension(item.FileName);
                    var itemPhotoFileName = $"{Guid.NewGuid()}{itemPhotoFileExtension}";
                    var itemPhotoPath = Path.Combine(uploadsFolder, itemPhotoFileName);

                    using (var stream = new FileStream(itemPhotoPath, FileMode.Create))
                    {
                        await item.CopyToAsync(stream);
                    }

                    newArticlePhoto.PhotoPath = $"/Photos/{itemPhotoFileName}";

                    articlePhotos.Add(newArticlePhoto);
                }

                await _databasecontext.ArticlePhotos.AddRangeAsync(articlePhotos);
                await _databasecontext.SaveChangesAsync();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticleAsync(int id)
        {
            var article = await _databasecontext.Articles.FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
                return NotFound();

            var articlePhotos = await _databasecontext.ArticlePhotos.Where(ap => ap.ArticleId == id).ToListAsync();

            if (!string.IsNullOrEmpty(article.MainPhotoPath))
            {
                var oldPhotoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", article.MainPhotoPath.TrimStart('/'));
                if (System.IO.File.Exists(oldPhotoPath))
                    System.IO.File.Delete(oldPhotoPath);
            }

            if(articlePhotos != null && articlePhotos.Any())
            {
                foreach (var itemPhoto in articlePhotos)
                {
                    var itemOldPhoto = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", itemPhoto.PhotoPath.TrimStart('/'));
                    if (System.IO.File.Exists(itemOldPhoto))
                        System.IO.File.Delete(itemOldPhoto);
                }

                _databasecontext.RemoveRange(articlePhotos);
            }

            _databasecontext.Remove(article);
            await _databasecontext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateStatusAsync(int id, [FromBody] UpdateArticleStatusRequestDto updateArticleStatusRequestDto)
        {
            var article = await _databasecontext.Articles.FirstOrDefaultAsync(a => a.Id == id);

            if (article == null)
                return NotFound();

            article.Active = updateArticleStatusRequestDto.Active;

            _databasecontext.Update(article);
            await _databasecontext.SaveChangesAsync();

            return NoContent();
        }
    }
}
