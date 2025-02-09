using ArtistryDemo.Models;
using ArtistryDemo.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

namespace ArtistryDemo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 64; // You can adjust the depth as needed
    });
            builder.Services.AddHttpClient();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDistributedMemoryCache();  // Required for session
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);  // Set session timeout as needed
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ArtistryDemo", Version = "v1" });
            });

            // Set up DBContext for SQL Server
            builder.Services.AddDbContext<ArtistryHubContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Register the login service
            builder.Services.AddScoped<ILoginService, LoginService>();
            builder.Services.AddScoped<IArtistServicesService, ArtistServicesService>();

            // Set up CORS policy for React frontend
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });


            builder.Services.AddSignalR();

            // Build the app
            var app = builder.Build();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }
           
            app.UseStaticFiles();

            // Enable session middleware
            app.UseSession();

            app.UseRouting();

            app.UseAuthentication(); // Make sure authentication middleware is used
            app.UseAuthorization();  // Make sure authorization middleware is used



            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.UseCors("AllowAll");

            // Map the controllers
            app.MapControllers();
            app.MapHub<ChatHub>("/chatHub");


            // Run the app
            app.Run();
        }
    }
}
