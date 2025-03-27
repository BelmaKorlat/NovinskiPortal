namespace NovinskiPortal.API.DTOs.Subcategory
{
    public class UpdateSubcategoryRequestDto
    {
        public string Name { get; set; } = default!;
        public int OrdinalNumber { get; set; }
        public bool Active { get; set; }
        public int CategoryId { get; set; }
    }
}
