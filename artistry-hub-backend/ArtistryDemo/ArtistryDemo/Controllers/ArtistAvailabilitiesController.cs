using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtistryDemo.Models;
using Newtonsoft.Json;
using ArtistryDemo.DTOs;

namespace ArtistryDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistAvailabilitiesController : ControllerBase
    {
        private readonly ArtistryHubContext _context;

        public ArtistAvailabilitiesController(ArtistryHubContext context)
        {
            _context = context;
        }

        // GET: api/ArtistAvailabilities
        [HttpGet]
        [Route("")]
        public async Task<ActionResult<IEnumerable<ArtistAvailability>>> GetArtistAvailabilities()
        {
            return await _context.ArtistAvailabilities.ToListAsync();
        }

        // GET: api/ArtistAvailabilities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<List<ArtistAvailability>>> GetArtistAvailability(int id)
        {
            var artistAvailability = await _context.ArtistAvailabilities
                                                   .Where(a => a.ArtistId == id)
                                                   .ToListAsync();

            if (!artistAvailability.Any())
            {
                return NotFound();
            }

            return Ok(artistAvailability);
        }

        [HttpGet]
        [Route("LoggedIn")]
        public async Task<ActionResult<List<ArtistAvailability>>> GetLoggedInArtistAvailability()
        {
            // Fetch user data from session
            var userDataString = HttpContext.Session.GetString("UserData");

            if (string.IsNullOrEmpty(userDataString))
            {
                return Unauthorized("User session data is missing or invalid.");
            }

            // Deserialize user data into a strongly-typed object
            UserSessionData userData;
            try
            {
                userData = JsonConvert.DeserializeObject<UserSessionData>(userDataString);
            }
            catch
            {
                return BadRequest("Failed to parse user session data.");
            }

            // Ensure the user is an artist
            if (userData.Role != "Artist")
            {
                return Forbid("Access denied. Only artists can access this resource.");
            }

            // Fetch artist's availability
            var artistAvailability = await _context.ArtistAvailabilities
                                                   .Where(a => a.ArtistId == userData.UserId)
                                                   .ToListAsync();

            if (!artistAvailability.Any())
            {
                return NotFound("No availability found for the logged-in artist.");
            }

            return Ok(artistAvailability);
        }



        // PUT: api/ArtistAvailabilities/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut]
        public async Task<IActionResult> PutArtistAvailability(int id,ArtistAvailability artistAvailability)
        {
            // Fetch user data from session
            var userDataString = HttpContext.Session.GetString("UserData");

            if (string.IsNullOrEmpty(userDataString))
            {
                return Unauthorized("User session data is missing or invalid.");
            }

            // Deserialize user data into a strongly-typed object
            UserSessionData userData;
            try
            {
                userData = JsonConvert.DeserializeObject<UserSessionData>(userDataString);
            }
            catch
            {
                return BadRequest("Failed to parse user session data.");
            }

            // Ensure the user is an artist
            if (userData.Role != "Artist")
            {
                return Forbid("Access denied. Only artists can modify their availability.");
            }

            // Check if the ArtistId matches the logged-in user's UserId
            if (artistAvailability.ArtistId != userData.UserId)
            {
                return Forbid("You can only modify your own availability.");
            }

            // Ensure the AvailabilityId matches the artistAvailability
            if (artistAvailability.AvailabilityId != id)
            {
                return BadRequest("Availability ID mismatch.");
            }

            // Mark the entity as modified and attempt to save changes
            _context.Entry(artistAvailability).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ArtistAvailabilityExists(artistAvailability.AvailabilityId))
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

        // POST: api/ArtistAvailabilities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ArtistAvailability>> PostArtistAvailability(ArtistAvailability artistAvailability)
        {
            // Fetch user data from session
            var userDataString = HttpContext.Session.GetString("UserData");

            if (string.IsNullOrEmpty(userDataString))
            {
                return Unauthorized("User session data is missing or invalid.");
            }

            // Deserialize user data into a strongly-typed object
            UserSessionData userData;
            try
            {
                userData = JsonConvert.DeserializeObject<UserSessionData>(userDataString);
            }
            catch
            {
                return BadRequest("Failed to parse user session data.");
            }

            // Ensure the user is an artist
            if (userData.Role != "Artist")
            {
                return Forbid("Access denied. Only artists can add their availability.");
            }

            // Set the ArtistId to the logged-in user's UserId
            artistAvailability.ArtistId = userData.UserId;

            // Add the new artist availability to the context
            _context.ArtistAvailabilities.Add(artistAvailability);

            try
            {
                // Save the changes to the database
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            // Return a CreatedAtAction result with the new availability
            return CreatedAtAction("GetArtistAvailability", new { id = artistAvailability.AvailabilityId }, artistAvailability);
        }


        // DELETE: api/ArtistAvailabilities/5
        [HttpDelete]
        public async Task<IActionResult> DeleteArtistAvailability(int id)
        {
            // Fetch user data from session
            var userDataString = HttpContext.Session.GetString("UserData");

            if (string.IsNullOrEmpty(userDataString))
            {
                return Unauthorized("User session data is missing or invalid.");
            }

            // Deserialize user data into a strongly-typed object
            UserSessionData userData;
            try
            {
                userData = JsonConvert.DeserializeObject<UserSessionData>(userDataString);
            }
            catch
            {
                return BadRequest("Failed to parse user session data.");
            }

            // Ensure the user is an artist
            if (userData.Role != "Artist")
            {
                return Forbid("Access denied. Only artists can delete their availability.");
            }

            // Find the artist availability to be deleted
            var artistAvailability = await _context.ArtistAvailabilities.FindAsync(id);

            if (artistAvailability == null)
            {
                return NotFound("The availability you are trying to delete does not exist.");
            }

            // Ensure the logged-in artist owns the availability
            if (artistAvailability.ArtistId != userData.UserId)
            {
                return Forbid("You can only delete your own availability.");
            }

            // Remove the artist availability from the database
            _context.ArtistAvailabilities.Remove(artistAvailability);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool ArtistAvailabilityExists(int id)
        {
            return _context.ArtistAvailabilities.Any(e => e.AvailabilityId == id);
        }
    }
    

}
