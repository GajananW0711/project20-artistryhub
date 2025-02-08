using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtistryDemo.Models;
using ArtistryDemo.DTOs;
using System.Text.Json;

namespace ArtistryDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly ArtistryHubContext _context;

        public EventsController(ArtistryHubContext context)
        {
            _context = context;
        }

        // GET: api/Events
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            return await _context.Events.ToListAsync();
        }

        // GET: api/Events/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var @event = await _context.Events.FindAsync(id);

            if (@event == null)
            {
                return NotFound();
            }

            return @event;
        }
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingEvents()
        {
            var pendingEvents = await _context.Events
                .Where(e => e.Status == "Pending")
                .ToListAsync();

            return Ok(pendingEvents);
        }

        [HttpPut("{eventId}/status")]
        public async Task<IActionResult> UpdateEventStatus(int eventId, [FromBody] StatusUpdateDto statusUpdate)
        {
            var eventToUpdate = await _context.Events.FindAsync(eventId);
            if (eventToUpdate == null)
                return NotFound(new { message = "Event not found" });
            if (statusUpdate.Status != "Approved" && statusUpdate.Status != "Rejected")
                return BadRequest(new { message = "Invalid status" });

            eventToUpdate.Status = statusUpdate.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Event {statusUpdate.Status.ToLower()} successfully" });
        }

       

        // POST: api/Events
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> CreateEvent([FromBody] EventDto eventDto)
        {
            if (eventDto == null)
                return BadRequest("Invalid event data");

            if (string.IsNullOrWhiteSpace(eventDto.EventDate))
                return BadRequest("Event date is required");

            if (!DateOnly.TryParse(eventDto.EventDate, out DateOnly parsedDate))
                return BadRequest("Invalid date format. Use YYYY-MM-DD.");

            // No need to find artist by userId. Use artistId directly from eventDto.
            
           

            var newEvent = new Event
            {
                ArtistId = eventDto.UserId,  // Use artistId directly
                EventName = eventDto.EventName,
                Description = eventDto.Description,
                EventDate = parsedDate,
                Location = eventDto.Location,
                EventPrice = eventDto.EventPrice,
                Status = "Pending",
                CreatedAt = DateTime.Now
            };

            _context.Events.Add(newEvent);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Event created successfully", eventId = newEvent.EventId });
        }




        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var eventItem = await _context.Events.FindAsync(id);

            if (eventItem == null)
            {
                return NotFound(new { message = "Event not found" });
            }

            _context.Events.Remove(eventItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Event deleted successfully" });
        }

        private bool EventExists(int id)
        {
            return _context.Events.Any(e => e.EventId == id);
        }
    }
}
