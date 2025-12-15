using AutoRef_API.Database;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AutoRef_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ClubsController: ControllerBase
    {
        private readonly AppDataBase _context;

        public ClubsController(AppDataBase context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetClubs()
        {
            var clubs = await _context.Clubs.ToListAsync();
            var clubsList = new List<object>();

            foreach (var club in clubs)
            {
                clubsList.Add(new
                {
                    club.Id,
                    club.Nombre
                });
            }

            return Ok(clubsList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Club>> GetClub(Guid id)
        {
            var club = await _context.Clubs.FindAsync(id);

            if (club == null)
            {
                return NotFound();
            }

            return club;
        }
    
    }
}
