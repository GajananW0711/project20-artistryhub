
using ArtistryDemo.Models;

namespace ArtistryDemo.Services
{
    public interface IArtistServicesService
    {
        Task<List<ArtistService>> GetArtistServicesAsync(int userId);
        Task<Service> GetServiceAsync(int serviceId);
    }
}
