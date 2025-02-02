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
    public class PortfoliosController : ControllerBase
    {
        private readonly ArtistryHubContext _context;

        public PortfoliosController(ArtistryHubContext context)
        {
            _context = context;
        }

        // GET: api/Portfolios
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Portfolio>>> GetPortfolioss()
        {
            return await _context.Portfolios.ToListAsync();
        }

        // GET: api/Portfolios/5
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<Portfolio>>> GetPortfolios()
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

            // Ensure the user is authorized to view portfolios (can be a check for artist, freelancer, etc.)
            if (userData.Role != "Artist")
            {
                return Forbid("Access denied. Only artists can view portfolios.");
            }

            // Fetch the list of portfolios for the logged-in artist (using ArtistId from session)
            var portfolios = await _context.Portfolios.Where(p => p.ArtistId == userData.UserId).ToListAsync();

            if (portfolios == null || !portfolios.Any())
            {
                return NotFound("No portfolios found for this artist.");
            }

            // Return the list of portfolios if found and the user is authorized
            return Ok(portfolios);
        }
        //[HttpGet("GetPortfolios")]
        //public async Task<ActionResult<IEnumerable<Portfolio>>> GetPortfolios(int artistId)
        //{

        //}

        // PUT: api/Portfolios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPortfolio(int id, Portfolio portfolio)
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

            // Ensure the user is authorized to update the portfolio (can be a check for artist, freelancer, etc.)
            if (userData.Role != "Artist")
            {
                return Forbid("Access denied. Only artists or freelancers can update a portfolio.");
            }

            // Ensure the logged-in user owns the portfolio
            var existingPortfolio = await _context.Portfolios.FindAsync(id);
            if (existingPortfolio == null)
            {
                return NotFound("The portfolio you are trying to update does not exist.");
            }

            // Check if the portfolio belongs to the logged-in user
            if (existingPortfolio.ArtistId != userData.UserId)
            {
                return Forbid("You can only update your own portfolio.");
            }

            // If the id matches, set the portfolio state as modified
            if (id != portfolio.PortfolioId)
            {
                return BadRequest();
            }

            _context.Entry(portfolio).State = EntityState.Modified;

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PortfolioExists(id))
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


        // POST: api/Portfolios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Portfolio>> PostPortfolio(Portfolio portfolio)
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

            // Ensure the user is authorized to create a portfolio (can be a check for artist, freelancer, etc.)
            if (userData.Role != "Artist")
            {
                return Forbid("Access denied. Only artists or freelancers can create a portfolio.");
            }

            // Set the UserId of the portfolio to the logged-in user's UserId
            portfolio.ArtistId = userData.UserId;

            // Add the new portfolio to the context
            _context.Portfolios.Add(portfolio);

            try
            {
                // Save the changes to the database
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

            // Return a CreatedAtAction result with the new portfolio
            return CreatedAtAction("GetPortfolio", new { id = portfolio.PortfolioId }, portfolio);
        }


        // DELETE: api/Portfolios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePortfolio(int id)
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

            // Ensure the user is authorized to delete a portfolio (can be a check for artist, freelancer, etc.)
            if (userData.Role != "Artist")
            {
                return Forbid("Access denied. Only artists or freelancers can delete a portfolio.");
            }

            // Find the portfolio to be deleted
            var portfolio = await _context.Portfolios.FindAsync(id);

            if (portfolio == null)
            {
                return NotFound("The portfolio you are trying to delete does not exist.");
            }

            // Ensure the logged-in user owns the portfolio
            if (portfolio.ArtistId != userData.UserId)
            {
                return Forbid("You can only delete your own portfolio.");
            }

            // Remove the portfolio from the database
            _context.Portfolios.Remove(portfolio);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        private bool PortfolioExists(int id)
        {
            return _context.Portfolios.Any(e => e.PortfolioId == id);
        }
    }
   

}
