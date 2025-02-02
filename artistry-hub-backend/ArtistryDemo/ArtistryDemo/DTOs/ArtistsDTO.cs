using ArtistryDemo.Models;

namespace ArtistryDemo.DTOs
{
    public class ArtistsDTO
    {
        public int ArtistId { get; set; }

        public int? UserId { get; set; }

        public string? Bio { get; set; }

        public string? ProfilePicture { get; set; }

        public string? PortfolioLink { get; set; }
        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;
        public string? Location { get; set; }
        public List<Service> services { get; set; }
    }
}
