using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ArtistryDemo.Models;

public partial class Artist
{
    public int ArtistId { get; set; }

    public int? UserId { get; set; }

    public string? Bio { get; set; }

    public string? ProfilePicture { get; set; }

    public string? PortfolioLink { get; set; }

    public virtual ICollection<ArtistAvailability> ArtistAvailabilities { get; set; } = new List<ArtistAvailability>();

    [JsonIgnore]
    public virtual ICollection<ArtistService> ArtistServices { get; set; } = new List<ArtistService>();

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Portfolio> Portfolios { get; set; } = new List<Portfolio>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual User? User { get; set; }

    public virtual ICollection<UserFavorite> UserFavorites { get; set; } = new List<UserFavorite>();
}
