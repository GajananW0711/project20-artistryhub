using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ArtistryDemo.Models;

public partial class Booking
{
    public int BookingId { get; set; }

    public int? UserId { get; set; }

    public int? ArtistId { get; set; }

    public int? ServiceId { get; set; }

    public DateTime? BookingDate { get; set; }

    public DateOnly EventDate { get; set; }

    public string? Status { get; set; }

    public decimal TotalAmount { get; set; }

    public virtual Artist? Artist { get; set; }

    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();

    [JsonIgnore]
    public virtual Service? Service { get; set; }

    public virtual User? User { get; set; }
}
