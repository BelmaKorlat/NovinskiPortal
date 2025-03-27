using NovinskiPortal.API.Models;
using System.Globalization;

namespace NovinskiPortal.API.DTOs.Article
{
    public class GetArticlesRequestDto
    {
        public string? Query { get; set; } = default!;
        public int? CategoryId { get; set; }
        public int? SubcategoryId { get; set; }
        public int? UserId { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
