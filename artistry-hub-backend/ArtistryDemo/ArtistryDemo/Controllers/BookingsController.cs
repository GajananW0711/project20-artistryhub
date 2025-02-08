using ArtistryDemo.Models;
using ArtistryDemo.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArtistryDemo.Controllers
{
    [Route("api")]
    [ApiController]
    public class BookingsController : ControllerBase
    {
        private readonly ArtistryHubContext _context;
        public BookingsController(ArtistryHubContext context)
        {
            _context = context;
           
        }
        [HttpPost("BookEvent")]
        public async Task<IActionResult> BookEvent([FromBody] Booking booking)
        {
            if (booking == null) return BadRequest("Invalid booking details.");

            var newBooking = new Booking
            {
                UserId = booking.UserId,
                ArtistId = booking.ArtistId,
                
                BookingDate = DateTime.Now,
                EventDate = booking.EventDate,
                Status = booking.Status,
                TotalAmount = booking.TotalAmount,
                
            };

            _context.Bookings.Add(newBooking);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking successful!" });
        }

    }
}
