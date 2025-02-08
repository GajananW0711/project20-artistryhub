using ArtistryDemo.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly ArtistryHubContext _context;
    private readonly IHubContext<ChatHub> _hubContext;

    public ChatController(ArtistryHubContext context, IHubContext<ChatHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] ChatMessage message)
    {

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // Notify the receiver
        await _hubContext.Clients.User(message.ReceiverId.ToString())
            .SendAsync("ReceiveMessage", message.SenderId, message.MessageText);

        return Ok();
    }

    [HttpGet("history/{userId}/{artistId}")]
    public IActionResult GetChatHistory(int userId, int artistId)
    {
        var messages = _context.Messages
            .Where(m => (m.SenderId == userId && m.ReceiverId == artistId) ||
                        (m.SenderId == artistId && m.ReceiverId == userId))
            .OrderBy(m => m.Timestamp)
            .ToList();

        return Ok(messages); // Directly return messages
    }


    [HttpGet("GetMessages")]
    public async Task<IActionResult> GetMessages([FromQuery] int userId)
    {
        // Fetch messages where the user is either the sender or receiver
        var messages = await (from m in _context.Messages
                              join sender in _context.Users on m.SenderId equals sender.UserId
                              join receiver in _context.Users on m.ReceiverId equals receiver.UserId
                              where m.SenderId == userId || m.ReceiverId == userId
                              orderby m.Timestamp
                              select new
                              {
                                  Id = m.Id,
                                  SenderName = sender.FirstName + " " + sender.LastName,
                                  ReceiverName = receiver.FirstName + " " + receiver.LastName,
                                  MessageText = m.MessageText,
                                  SenderId = m.SenderId,
                                  ReceiverId = m.ReceiverId,
                                  Timestamp = m.Timestamp
                              })
                       .ToListAsync();

        return Ok(messages);
    }

}


