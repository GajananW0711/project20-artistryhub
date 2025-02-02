using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtistryDemo.Models;

namespace ArtistryDemo.Controllers
{
    [ApiController]
    [Route("api/services-for-user")]
    public class ServicesControllerForUser : ControllerBase
    {
        private readonly ArtistryHubContext _context;

        public ServicesControllerForUser(ArtistryHubContext context)
        {
            _context = context;
        }

        // GET: api/services-for-user/get-all-services
        [HttpGet("get-all-services")]
        public async Task<IActionResult> GetAllServices()
        {
            var services = await _context.Services
                .Include(s => s.Category)
                .ToListAsync();

            return Ok(services);
        }

        // GET: api/services-for-user/get-service-by-id/{id}
        [HttpGet("get-service-by-id/{id:int}")]
        public async Task<IActionResult> GetServiceById(int id)
        {
            var service = await _context.Services
                .Include(s => s.Category)
                .FirstOrDefaultAsync(m => m.ServiceId == id);

            if (service == null)
            {
                return NotFound($"Service with ID {id} not found.");
            }

            return Ok(service);
        }
    }
}
