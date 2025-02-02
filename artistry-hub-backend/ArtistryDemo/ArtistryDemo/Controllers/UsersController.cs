using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtistryDemo.Models;
using ArtistryDemo.DTOs;
using System.Net.Http;

namespace ArtistryDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ArtistryHubContext _context;
        private readonly HttpClient _httpClient;

        public UsersController(ArtistryHubContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArtistsDTO>>> GetMatchingArtists()
        {
            var users = await _context.Users.ToListAsync();
            var artists = await _context.Artists.ToListAsync();

            if (users == null || artists == null)
            {
                return NotFound(); // Return 404 if no users or artists are found
            }

            // Create a list to hold the matching artists' DTOs
            var matchingArtists = new List<ArtistsDTO>();

            foreach (var artist in artists)
            {
                // Check if the artist has a corresponding user
                var user = users.FirstOrDefault(u => u.UserId == artist.UserId);
                if (user != null)
                {
                    // Call the external API to get services for the artist (you can use HttpClient here)
                    var servicess = await GetServicesForArtist(artist.ArtistId);

                    // Create a DTO object and populate it
                    var artistDto = new ArtistsDTO
                    {
                        ArtistId = artist.ArtistId,
                        UserId = user.UserId,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Location = user.Location,
                        Bio = artist.Bio,
                        ProfilePicture = artist.ProfilePicture,
                        PortfolioLink = artist.PortfolioLink,
                        services = servicess // Add the list of services
                    };

                    // Add to the list of matching artists
                    matchingArtists.Add(artistDto);
                }
            }

            return Ok(matchingArtists);
        }
        [HttpGet("api/ArtistServices/{artistId}")]
        public async Task<List<Service>> GetServicesForArtist(int artistId)
        {
            // Initialize the list to hold the services
            var services = new List<Service>();

            // Send a GET request to fetch services related to the artist
            var response = await _httpClient.GetAsync($"https://localhost:44327/api/ArtistServices/{artistId}");

            if (response.IsSuccessStatusCode)
            {
                // Deserialize the response into a list of service IDs (assuming the API returns a list of service IDs)
                var artistServices = await response.Content.ReadAsAsync<List<ArtistService>>();

                // Iterate through the artist services and fetch the full Service details from the database
                foreach (var artistService in artistServices)
                {
                    var service = await _context.Services
                        .FirstOrDefaultAsync(s => s.ServiceId == artistService.ServiceId);

                    if (service != null)
                    {
                        services.Add(service);
                    }
                }
            }

            return services;
        }




        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
        [HttpGet("{artistId}")]
        public async Task<ActionResult<Artist>> GetArtistById(int artistId)
        {
            var artist = await _context.Artists
                .FirstOrDefaultAsync(a => a.ArtistId == artistId);

            if (artist == null)
            {
                return NotFound("Artist not found.");
            }

            return Ok(artist);
        }
        [HttpGet("/get-artist/{serviceId}")]
        public async Task<ActionResult<List<UserArtistDTO>>> GetArtistByServiceId(int serviceId)
        {
            var artistServices = await _context.ArtistServices
                .Where(a => a.ServiceId == serviceId)
                .ToListAsync();

            if (!artistServices.Any())
            {
                return NotFound("No artists found for this service.");
            }

            // Fetch all artist IDs from artistServices
            var artistIds = artistServices.Select(a => a.ArtistId).ToList();

            // Fetch all artists in a single query
            var artists = await _context.Artists
                .Where(a => artistIds.Contains(a.ArtistId))
                .ToListAsync();

            // Fetch all users in a single query
            var userIds = artists.Select(a => a.ArtistId).ToList(); // Assuming ArtistId == UserId
            var users = await _context.Users
                .Where(u => userIds.Contains(u.UserId))
                .ToListAsync();

            // Combine data into DTOs
            var artistDTOs = artists.Select(artist =>
            {
                var user = users.FirstOrDefault(u => u.UserId == artist.ArtistId);
                if (user == null) return null; // Skip if no matching user is found

                return new UserArtistDTO
                {
                    UserId = user.UserId,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    ArtistId = artist.ArtistId,
                    Bio = artist.Bio,
                    ProfilePicture = artist.ProfilePicture,
                    PortfolioLink = artist.PortfolioLink
                };
            }).Where(dto => dto != null).ToList(); // Remove null entries

            return Ok(artistDTOs);
        }



        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser([FromBody] UserWithArtistDto userWithArtistDto)
        {
            var user = userWithArtistDto.User;
            var artist = userWithArtistDto.Artist;

            if (artist != null && !string.IsNullOrEmpty(artist.Bio))
            {
                artist.UserId = user.UserId;
                _context.Artists.Add(artist);
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }


        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
   




}
