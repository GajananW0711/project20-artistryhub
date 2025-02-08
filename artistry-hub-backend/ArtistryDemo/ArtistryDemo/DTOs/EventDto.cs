using System.ComponentModel.DataAnnotations;

namespace ArtistryDemo.DTOs
{
    public class EventDto
    {
        public int UserId { get; set; }
        public string EventName { get; set; }
        public string Description { get; set; }
        [Required]
        public string EventDate { get; set; }
        public string Location { get; set; }
        public int? EventPrice { get; set; }
    }
}
