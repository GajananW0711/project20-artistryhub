using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArtistryDemo.Models;

namespace ArtistryDemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesControllerForUser : ControllerBase
    {
        private readonly ArtistryHubContext _context;

        public CategoriesControllerForUser(ArtistryHubContext context)
        {
            _context = context;
        }

        // GET: api/CategoriesControllerForUser
        [HttpGet("get-all-categories")]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            if (categories == null || categories.Count == 0)
            {
                return NotFound(new { message = "No categories found." });
            }

            return Ok(categories);
        }

        // GET: api/CategoriesControllerForUser/{id}
        [HttpGet("get-category-by-id/{id:int}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(m => m.CategoryId == id);

            if (category == null)
            {
                return NotFound(new { message = $"Category with ID {id} not found." });
            }

            return Ok(category);
        }
    }
}
