namespace NovinskiPortal.API.DTOs.Article
{
    public class GetArticlesResponseDto
    {
        public IEnumerable<GetArticlesItemResponseDto> Items { get; set; } = default!;
        public int TotalCount { get; set; }
        
    }
}
