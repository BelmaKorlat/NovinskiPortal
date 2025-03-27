using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovinskiPortal.API.DTOs.Article;
using NovinskiPortal.API.DTOs.Category;
using NovinskiPortal.API.DTOs.Subcategory;
using NovinskiPortal.API.Models;

namespace NovinskiPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubcategoriesController : ControllerBase
    {
        private readonly DatabaseContext _databasecontext;
        private readonly IMapper _mapper;

        public SubcategoriesController(DatabaseContext databasecontext, IMapper mapper)
        {
            _databasecontext = databasecontext;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<GetSubcategoryResponseDto>> GetSubcategoriesAsync([FromQuery] int? categoryId, [FromQuery] bool? active)
        {
            var query = _databasecontext.Subcategories.Include(c => c.Category).AsQueryable();

            if (active != null)
                query = query.Where(s => s.Active == active);

            if (categoryId != null)
                query = query.Where(s => s.CategoryId == categoryId);

            query = query.OrderBy(s => s.Category.OrdinalNumber).ThenBy(s => s.OrdinalNumber);

            var result = await query.ToListAsync();

            var mappedResult = _mapper.Map<IEnumerable<GetSubcategoryResponseDto>>(result);

            return mappedResult;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubcategoryById(int id)
        {
            var subcategory = await _databasecontext.Subcategories.FirstOrDefaultAsync(s => s.Id == id);

            if (subcategory == null)
                return NotFound();

            return Ok(subcategory);
        }

        [HttpPost]
        public async Task<Subcategory> CreateSubcategoryAsync([FromBody] CreateSubcategoryRequestDto createSubcategoryRequestDto)
        {
            var newSubcategory = _mapper.Map<Subcategory>(createSubcategoryRequestDto);

            _databasecontext.Add(newSubcategory);
            await _databasecontext.SaveChangesAsync();

            return newSubcategory;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSubcategoryAsync(int id, [FromBody] UpdateSubcategoryRequestDto updateSubcategoryRequestDto)
        {
            var subcategory = await _databasecontext.Subcategories.FirstOrDefaultAsync(s => s.Id == id);

            if (subcategory == null)
                return NotFound();

            subcategory = _mapper.Map(updateSubcategoryRequestDto, subcategory);

            _databasecontext.Update(subcategory);
            await _databasecontext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubcategoryAsync(int id)
        {
            var subcategory = await _databasecontext.Subcategories.FirstOrDefaultAsync(s => s.Id == id);

            if (subcategory == null)
                return NotFound();

            _databasecontext.Remove(subcategory);
            await _databasecontext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ToggleSubcategoryStatusAsync(int id, [FromBody] UpdateSubcategoryStatusRequestDto updateSubcategoryStatusRequestDto)
        {
            var subcategory = await _databasecontext.Subcategories.FirstOrDefaultAsync(s => s.Id == id);

            if (subcategory == null)
                return NotFound();

            subcategory.Active = updateSubcategoryStatusRequestDto.Active;

            _databasecontext.Update(subcategory);
            await _databasecontext.SaveChangesAsync();

            return NoContent();
        }
    }
}
