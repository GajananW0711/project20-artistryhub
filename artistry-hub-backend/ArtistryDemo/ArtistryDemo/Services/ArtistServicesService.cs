using ArtistryDemo.Models;
using Azure.Core;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace ArtistryDemo.Services
{
    public class ArtistServicesService : IArtistServicesService
    {
        private readonly ArtistryHubContext _context;

        public ArtistServicesService(ArtistryHubContext context)
        {
            _context = context;
        }

        public async Task<List<ArtistService>> GetArtistServicesAsync(int userId)
        {
            // Fetch all artist services for the given user ID with related data
            var artistServices = await _context.ArtistServices
                .Where(service => service.ArtistId == userId)
                .Include(service => service.Service) // Include Service data
                .ThenInclude(service => service.Bookings) // Include nested Bookings data
                .Include(service => service.Service.Category) // Include Category data
                .Include(service => service.Service.Portfolios) // Include Portfolios data
                .Include(service => service.Service.Reviews) // Include Reviews data
                .Include(service => service.Artist) // Include Artist data
                .ToListAsync();

            return artistServices;
        }


        public async Task<Service> GetServiceAsync(int serviceId)
        {

            var service = await _context.Services
         .FirstOrDefaultAsync(s => s.ServiceId == serviceId);

            return service;
        }
    }
}
