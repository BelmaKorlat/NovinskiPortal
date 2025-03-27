namespace NovinskiPortal.API.DTOs.Category
{
    public class UpdateCategoryRequestDto
    {
        public string Name { get; set; } = default!;
        public int OrdinalNumber { get; set; }
        public string Color { get; set; } = default!;
        public bool Active { get; set; }
    }
}
