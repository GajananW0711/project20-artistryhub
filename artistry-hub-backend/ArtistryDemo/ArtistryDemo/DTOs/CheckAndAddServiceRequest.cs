namespace ArtistryDemo.DTOs
{
    public class CheckAndAddServiceRequest
    {
        public int UserId { get; set; }
        public int ServiceId { get; set; }
        public decimal Price { get; set; }
        public string Availability { get; set; }
    }
}
