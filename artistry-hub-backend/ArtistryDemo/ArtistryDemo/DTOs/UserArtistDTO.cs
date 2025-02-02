namespace ArtistryDemo.DTOs
{
    public class UserArtistDTO
    {
        public int UserId { get; set; }

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;
        public int ArtistId { get; set; }



        public string? Bio { get; set; }

        public string? ProfilePicture { get; set; }

        public string? PortfolioLink { get; set; }
    }
}
