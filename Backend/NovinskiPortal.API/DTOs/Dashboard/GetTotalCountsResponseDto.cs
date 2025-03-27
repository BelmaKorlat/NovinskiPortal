namespace NovinskiPortal.API.DTOs.Dashboard
{
    public class GetTotalCountsResponseDto
    {
        public int TotalArticles { get; set; }
        public int TotalCategories { get; set; }
        public int TotalSubcategories { get; set; }
        public int TotalUsers { get; set; }
    }
}
