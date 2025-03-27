using NovinskiPortal.API.DTOs.Subcategory;

namespace NovinskiPortal.API.DTOs.Category
{
    public class CategoryMenuDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Color { get; set; } = default!;
        public List<SubcategoryDto> Subcategories { get; set; } = new List<SubcategoryDto>();
    }
}
