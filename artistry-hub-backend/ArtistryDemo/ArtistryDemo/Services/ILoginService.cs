using ArtistryDemo.Models;
using Azure.Core;

namespace ArtistryDemo.Services
{
    public interface ILoginService
    {
        Task<User?> AuthenticateUserAsync(string email, string password);
        Task<Artist?> AuthenticateArtistAsync(string email, string password);
        Task<Admin?> AuthenticateAdminAsync(string email, string password);
  
    }
}
