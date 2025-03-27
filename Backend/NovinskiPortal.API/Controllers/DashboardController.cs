using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovinskiPortal.API.DTOs.Dashboard;

namespace NovinskiPortal.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DatabaseContext _databasecontext;

        public DashboardController(DatabaseContext databaseContext)
        {
            _databasecontext = databaseContext;
        }

        [HttpGet("totals")]
        public async Task<IActionResult> GetTotalCountsAsync()
        {
            var totalCounts = new GetTotalCountsResponseDto();
            totalCounts.TotalArticles = await _databasecontext.Articles.CountAsync();
            totalCounts.TotalCategories = await _databasecontext.Categories.CountAsync();
            totalCounts.TotalSubcategories = await _databasecontext.Subcategories.CountAsync();
            totalCounts.TotalUsers = await _databasecontext.Users.CountAsync();

            return Ok(totalCounts);
        }

    }
}
