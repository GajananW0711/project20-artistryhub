using System.Threading.Tasks;
using ArtistryDemo.Models;
using ArtistryDemo.Services;
using Microsoft.EntityFrameworkCore;

public class LoginService : ILoginService
{
    private readonly ArtistryHubContext _context;

    public LoginService(ArtistryHubContext context)
    {
        _context = context;
    }

    public async Task<User?> AuthenticateUserAsync(string email, string password)
    {
        // Find user by email and check the password (no hashing)
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && u.Password == password);

        return user;
    }

    public async Task<Artist?> AuthenticateArtistAsync(string email, string password)
    {
        // Find user by email first, then check the password (no hashing)
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email && u.Password == password);

        if (user != null)
        {
            // Find corresponding artist by userId
            var artist = await _context.Artists
                .FirstOrDefaultAsync(a => a.UserId == user.UserId);
            return artist;
        }

        return null;
    }

    public async Task<Admin?> AuthenticateAdminAsync(string email, string password)
    {
        // Find admin by email and check the password (no hashing)
        var admin = await _context.Admins
            .FirstOrDefaultAsync(a => a.Email == email && a.Password == password);

        return admin;
    }
}
