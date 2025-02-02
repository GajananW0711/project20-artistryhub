using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtistryDemo.Models;
using Newtonsoft.Json;

namespace ArtistryDemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsControllerForArtists : ControllerBase
    {
        private readonly ArtistryHubContext _context;

        public ReviewsControllerForArtists(ArtistryHubContext context)
        {
            _context = context;
        }

        // GET: api/ReviewsControllerForArtists/get-reviews
        [HttpGet("get-reviews")]
        public async Task<IActionResult> GetReviews()
        {
            // Get user data from session
            var userDataString = HttpContext.Session.GetString("UserData")?.Trim();

            if (string.IsNullOrEmpty(userDataString))
            {
                return Unauthorized(new { Message = "User data is missing or unauthorized." });
            }

            var userData = JsonConvert.DeserializeObject<dynamic>(userDataString);

            // Extract the userId
            int? userId = userData?.UserId;
            if (userId == null)
            {
                return BadRequest(new { Message = "Invalid user data." });
            }

            // Fetch reviews for the given artist (userId)
            var reviews = await _context.Reviews
                .Where(review => review.ArtistId == userId)
                .Include(r => r.Artist)   // Include related Artist data
                .Include(r => r.Service)  // Include related Service data
                .Include(r => r.User)     // Include related User data
                .ToListAsync();

            if (reviews == null || reviews.Count == 0)
            {
                return NotFound(new { Message = "No reviews found for the given artist." });
            }

            // Return the reviews as JSON
            return Ok(reviews);
        }
    }
}
