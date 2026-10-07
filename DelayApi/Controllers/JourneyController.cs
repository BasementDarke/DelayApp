using DelayApi.Models;
using DelayApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Playwright.Core;
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

            JourneyResponse? responseData = await _journeyService.SearchAsync("Helsingborg C", "Lund C", 0);
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

        [HttpPost]
        public async Task<ActionResult> ScheduleSearch(JourneySearch journeySearch)
        {
            var taskKey = journeySearch.TaskKey;
            var departureStation = journeySearch.DepartureStation;
            var arrivalStation = journeySearch.ArrivalStation;

            Console.WriteLine(taskKey);
            Console.WriteLine(departureStation);
            Console.WriteLine(arrivalStation);
            JourneyResponse? responseData = await _journeyService.SearchAsync(departureStation, arrivalStation, taskKey);
            return responseData is null ? NotFound() : Ok(responseData);
        }

        // return NotFound if search fails, for error purposes
        // Return Json Data
    }
}
