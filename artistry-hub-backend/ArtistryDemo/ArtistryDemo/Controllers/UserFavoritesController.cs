using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtistryDemo.Models;

namespace ArtistryDemo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserFavoritesController : ControllerBase
    {
        private readonly ArtistryHubContext _context;

        public UserFavoritesController(ArtistryHubContext context)
        {
            _context = context;
        }

        // GET: api/UserFavorites
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserFavorite>>> GetUserFavorites()
        {
            return await _context.UserFavorites.ToListAsync();
        }

        // GET: api/UserFavorites/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserFavorite>> GetUserFavorite(int id)
        {
            var userFavorite = await _context.UserFavorites.FindAsync(id);

            if (userFavorite == null)
            {
                return NotFound();
            }

            return userFavorite;
        }

        // PUT: api/UserFavorites/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserFavorite(int id, UserFavorite userFavorite)
        {
            if (id != userFavorite.FavoriteId)
            {
                return BadRequest();
            }

            _context.Entry(userFavorite).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserFavoriteExists(id))
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

        // POST: api/UserFavorites
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserFavorite>> PostUserFavorite(UserFavorite userFavorite)
        {
            _context.UserFavorites.Add(userFavorite);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserFavorite", new { id = userFavorite.FavoriteId }, userFavorite);
        }

        // DELETE: api/UserFavorites/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserFavorite(int id)
        {
            var userFavorite = await _context.UserFavorites.FindAsync(id);
            if (userFavorite == null)
            {
                return NotFound();
            }

            _context.UserFavorites.Remove(userFavorite);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserFavoriteExists(int id)
        {
            return _context.UserFavorites.Any(e => e.FavoriteId == id);
        }
    }
}
