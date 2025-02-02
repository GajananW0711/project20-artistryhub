using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace ArtistryDemo.Models;

public partial class Category
{
    public int CategoryId { get; set; }

    public string CategoryName { get; set; } = null!;

    public string? Description { get; set; }

    [JsonIgnore]
    public virtual ICollection<Service> Services { get; set; } = new List<Service>();
}
