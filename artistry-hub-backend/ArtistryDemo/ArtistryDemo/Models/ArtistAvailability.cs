using System;
using System.Collections.Generic;

namespace ArtistryDemo.Models;

public partial class ArtistAvailability
{
    public int AvailabilityId { get; set; }

    public int? ArtistId { get; set; }

    public string? DayOfWeek { get; set; }

    public TimeOnly? StartTime { get; set; }

    public TimeOnly? EndTime { get; set; }

    public virtual Artist? Artist { get; set; }
}
