using ArtistryDemo.Models;

namespace ArtistryDemo.DTOs
{
    public class UserRegistrationDTO
    {
       

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Location { get; set; } = null!;
        public DateTime? CreatedAt { get; set; }




        public string? Bio { get; set; }

        public string? ProfilePicture { get; set; }

       
        public string Role { get; set; }

    }
}
