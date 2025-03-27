using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovinskiPortal.API.DTOs.Category;
using NovinskiPortal.API.DTOs.Subcategory;
using NovinskiPortal.API.Models;

namespace NovinskiPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;
        private readonly IMapper _mapper;
        public CategoriesController(DatabaseContext databaseContext, IMapper mapper)
        {
            _databaseContext = databaseContext;
            _mapper = mapper;
        } 

        [HttpGet]
        public async Task<IEnumerable<Category>> GetCategoriesAsync([FromQuery] GetCategoryRequestDto getCategoryRequestDto)
        {
            var query = _databaseContext.Categories.AsQueryable();

            if (getCategoryRequestDto.Active != null)
                query = query.Where(c => c.Active == getCategoryRequestDto.Active);

            var result = await query.ToListAsync();

            return result;
        }

        [HttpGet("categories-menu")]
        public async Task<IActionResult> GetCategorySubcategoryAsync()
        {
            var categories = await _databaseContext.Categories.Where(c => c.Active == true).ToListAsync();

            var subcategories = await _databaseContext.Subcategories.Where(s => s.Active == true).ToListAsync();

            var result = categories.Select(c => new CategoryMenuDto
            {
                Id = c.Id,
                Name = c.Name,
                Color = c.Color,
                Subcategories= subcategories.Where(s => s.CategoryId == c.Id).Select(s => new SubcategoryDto
                {
                    Id = s.Id,
                    Name = s.Name
                }).ToList()
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _databaseContext.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound();

            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategoryAsync([FromBody] CreateCategoryRequestDto createCategoryRequestDto)
        {
            var newCategory = _mapper.Map<Category>(createCategoryRequestDto);

            _databaseContext.Add(newCategory);
            await _databaseContext.SaveChangesAsync();

            return Ok(newCategory);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategoryAsync(int id, [FromBody] UpdateCategoryRequestDto updateCategoryRequestDto)
        {
            var category = await _databaseContext.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound();

            category = _mapper.Map(updateCategoryRequestDto, category);

            _databaseContext.Update(category);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoryAsync(int id)
        {
            var category = await _databaseContext.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound();

            _databaseContext.Remove(category);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ToggleCategoryStatusAsync(int id, [FromBody] UpdateCategoryStatusRequestDto updateCategoryStatusRequestDto)
        {
            var category = await _databaseContext.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
                return NotFound();

            category.Active = updateCategoryStatusRequestDto.Active;

            _databaseContext.Update(category);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
