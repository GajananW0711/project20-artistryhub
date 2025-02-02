using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ArtistryDemo.Models;
using ArtistryDemo.Services;
using ArtistryDemo.DTOs;

namespace ArtistryDemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArtistServicesController : ControllerBase
    {
        private readonly ArtistryHubContext _context;
        private readonly IArtistServicesService _artistServicesService;

        public ArtistServicesController(ArtistryHubContext context, IArtistServicesService artistServicesService)
        {
            _context = context;
            _artistServicesService = artistServicesService;
        }

        // GET: api/ArtistServices
        [HttpGet]
        public async Task<IActionResult> GetArtistServices()
        {
            // Retrieve user data from session
            var userDataString = HttpContext.Session.GetString("UserData");

            if (string.IsNullOrEmpty(userDataString))
            {
                return Unauthorized("User session data is missing or invalid.");
            }

            // Deserialize user data
            dynamic userData;
            try
            {
                userData = JsonConvert.DeserializeObject<dynamic>(userDataString);
            }
            catch
            {
                return BadRequest("Failed to parse user session data.");
            }

            // Extract userId
            if (!int.TryParse((string)userData?.UserId, out int userId))
            {
                return BadRequest("Invalid UserId in session data.");
            }

            // Fetch artist services
            var artistServices = await _artistServicesService.GetArtistServicesAsync(userId);
            if (artistServices == null || artistServices.Count == 0)
            {
                return NotFound("No artist services found for the given user.");
            }

            return Ok(artistServices);
        }
        [HttpGet("{artistId}")]
        public async Task<ActionResult<Artist>> GetArtistServiceById(int artistId)
        {
            // Fetch the artist by artistId
            var artistServices = await _context.ArtistServices.Where(a => a.ArtistId == artistId).Include(a => a.Service).ToListAsync();

            // Check if the artist exists
            if (artistServices == null)
            {
                return NotFound();  // Return 404 if not found
            }
            return Ok(artistServices);  // Return the artist data as a response
        }
        // POST: api/ArtistServices
        [HttpPost]
        public async Task<IActionResult> CheckAndAddService([FromBody] CheckAndAddServiceRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid request data.");
            }

            // Validate service existence
            if (!await CheckServiceAvailability(request.ServiceId))
            {
                return NotFound("Service not found.");
            }

            // Retrieve user data from session
            var userDataString = HttpContext.Session.GetString("UserData");
            if (string.IsNullOrEmpty(userDataString))
            {
                return Unauthorized("User session data is missing or invalid.");
            }

            dynamic userData;
            try
            {
                userData = JsonConvert.DeserializeObject<dynamic>(userDataString);
            }
            catch
            {
                return BadRequest("Failed to parse user session data.");
            }

            if (!int.TryParse((string)userData?.UserId, out int userId))
            {
                return BadRequest("Invalid UserId in session data.");
            }

            // Fetch service details
            var service = await _artistServicesService.GetServiceAsync(request.ServiceId);
            if (service == null)
            {
                return NotFound("The specified service does not exist.");
            }

            // Create a new ArtistService object
            var artistService = new ArtistService
            {
                ArtistId = userId,
                ServiceId = service.ServiceId,
                Price = request.Price,
                Availability = request.Availability
            };

            // Save to the database
            try
            {
                _context.ArtistServices.Add(artistService);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while saving the artist service. {ex.Message}");
            }

            return Ok(new
            {
                Message = "Artist Service created successfully.",
                ArtistService = artistService
            });
        }

        private async Task<bool> CheckServiceAvailability(int serviceId)
        {
            return await _context.Services.AnyAsync(s => s.ServiceId == serviceId);
        }
    }

    
}
