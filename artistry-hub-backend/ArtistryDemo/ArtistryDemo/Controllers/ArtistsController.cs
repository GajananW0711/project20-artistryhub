using ArtistryDemo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

[Route("api/artists")]
[ApiController]
public class ArtistsController : ControllerBase
{
    private readonly ArtistryHubContext _context;

    public ArtistsController(ArtistryHubContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetArtists()
    {
        var artists = (from user in _context.Users
                       join artist in _context.Artists on user.UserId equals artist.UserId
                       select user).ToList();

        return Ok(artists);
    }

    [HttpGet("{artistId}")]
    public async Task<IActionResult> GetArtistDetails(int artistId)
    {
        var artist = await _context.Artists
            .Include(a => a.User) // Join with users table
            .Include(a => a.Portfolios) // Join with portfolios table
            .Where(a => a.ArtistId == artistId)
            .Select(a => new
            {
                FirstName = a.User.FirstName,
                LastName = a.User.LastName,
                Location = a.User.Location,
                Bio = a.Bio,
                ProfilePicture = a.ProfilePicture,
                Portfolios = a.Portfolios.Select(p => new
                {
                    PortfolioImage = p.PortfolioImage,
                    Description = p.Description
                }).ToList()
            })
            .FirstOrDefaultAsync();

        if (artist == null)
        {
            return NotFound("Artist not found.");
        }

        return Ok(artist);
    }

    [HttpDelete("{userId}")]
    public IActionResult DeleteArtist(int userId)
    {
        var artist = _context.Artists.FirstOrDefault(a => a.UserId == userId);
        if (artist == null)
        {
            return NotFound(new { message = "Artist not found" });
        }

        _context.Artists.Remove(artist);
        _context.SaveChanges();

        return Ok(new { message = "Artist deleted successfully" });
    }
}
