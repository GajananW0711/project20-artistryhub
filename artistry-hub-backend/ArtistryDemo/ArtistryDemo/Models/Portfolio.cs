using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ArtistryDemo.Models;

public partial class Portfolio
{
    public int PortfolioId { get; set; }

    public int? ArtistId { get; set; }

    public int? ServiceId { get; set; }

    public string? PortfolioImage { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Artist? Artist { get; set; }

    [JsonIgnore]
    public virtual Service? Service { get; set; }
}
