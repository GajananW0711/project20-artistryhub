using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ArtistryDemo.Models;

public partial class ArtistService
{
    public int ArtistServiceId { get; set; }

    public int? ArtistId { get; set; }

    public int? ServiceId { get; set; }

    public decimal? Price { get; set; }

    public string? Availability { get; set; }

    public virtual Artist? Artist { get; set; }

    
    public virtual Service? Service { get; set; }
}
