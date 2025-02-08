using System;
using System.Collections.Generic;

namespace ArtistryDemo.Models;

using System.ComponentModel.DataAnnotations.Schema;

public partial class Event
{
    public int EventId { get; set; }

    public int? ArtistId { get; set; }

    public string EventName { get; set; } = null!;

    public string? Description { get; set; }

    public DateOnly EventDate { get; set; }

    public string? Location { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? Status { get; set; }

     
    public int? EventPrice { get; set; }

    public virtual Artist? Artist { get; set; }
}

