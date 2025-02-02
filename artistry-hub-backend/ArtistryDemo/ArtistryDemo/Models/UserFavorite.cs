using System;
using System.Collections.Generic;

namespace ArtistryDemo.Models;

public partial class UserFavorite
{
    public int FavoriteId { get; set; }

    public int? UserId { get; set; }

    public int? ArtistId { get; set; }

    public int? ServiceId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Artist? Artist { get; set; }

    public virtual Service? Service { get; set; }

    public virtual User? User { get; set; }
}
