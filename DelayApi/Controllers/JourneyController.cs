using DelayApi.Models;
using DelayApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace DelayApi.Controllers
{
    [ApiController]
    [Route("api/journey")]
    public class JourneyController : Controller
    {
        private readonly JourneyService _journeyService;
        public JourneyController()
        {
            _journeyService = new JourneyService();
        }

        [HttpGet]
        public async Task<ActionResult> Index()
        {
            JsonElement? responseData = await _journeyService.SearchAsync("Helsingborg C", "Lund C", 0);
            //Dictionary<int, Journey>[] journeys = await this._journeyService.SearchAsync("Helsingborg C", "Lund C", 0);
            //for(int i = 0; i < journeys.Length; i++)
            //{
            //    Journey value;
            //    journeys[0].TryGetValue(i, out value);
            //    Console.WriteLine(value.Id);
            //}

            return responseData is null ? NotFound() : Ok(responseData);
            //return Ok("balls");
        }

        // return NotFound if search fails, for error purposes
        // Return Json Data
    }
}
