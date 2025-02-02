using ArtistryDemo.DTOs;
using ArtistryDemo.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly ILoginService _loginService;

    public LoginController(ILoginService loginService)
    {
        _loginService = loginService;
    }

    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Invalid request data." });
        }

        // Authenticate user and retrieve role
        var user = await _loginService.AuthenticateUserAsync(request.Email, request.Password);
        var artist = await _loginService.AuthenticateArtistAsync(request.Email, request.Password);
        var admin = await _loginService.AuthenticateAdminAsync(request.Email, request.Password);

        if (user == null && artist == null && admin == null)
        {
            return Unauthorized(new { message = "Invalid credentials." });
        }

        // Determine role
        string role = admin != null
            ? "Admin"
            : artist != null
            ? "Artist"
            : "User";

        // Get user details
        var userId = user?.UserId ?? artist?.ArtistId ?? admin?.AdminId;
        var fullName = $"{user?.FirstName ?? admin?.FirstName} {user?.LastName ?? admin?.LastName}";
        var email = user?.Email ?? admin?.Email;

        // Store user data in session
        var userData = new { UserId = userId, Role = role };
        HttpContext.Session.SetString("UserData", JsonConvert.SerializeObject(userData));

        // Return response
        return Ok(new
        {
            UserId = userId,
            FullName = fullName,
            Email = email,
            Role = role
        });
    }
}


