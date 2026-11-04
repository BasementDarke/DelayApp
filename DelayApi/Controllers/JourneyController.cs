using DelayApi.Exceptions;
using DelayApi.Models;
using DelayApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace DelayApi.Controllers
{
    [ApiController]
    public class JourneyController : Controller
    {
        private readonly JourneyService _journeyService;
        public JourneyController(JourneyService journeyService)
        {
            _journeyService = journeyService;
        }

        [Route("/api/journey")]
        [HttpPost]
        public async Task<ActionResult> ScheduleSearch(JourneySearch journeySearch)
        {
            var taskKey = journeySearch.TaskKey;
            var departureStation = journeySearch.DepartureStation;
            var arrivalStation = journeySearch.ArrivalStation;
            try
            {
                JourneyResponse responseData = await _journeyService.SearchAsync(departureStation, arrivalStation, taskKey);
                Console.WriteLine(responseData);
                return Ok(responseData);
            }
            catch (JourneyException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("/api/journey/points/{name}")]
        [HttpGet]
        public async Task<ActionResult> AutocompleteSearch(string name)
        {
            try
            {
                SkaneTrafikenPointsResponse responseData = await _journeyService.AutocompletePoints(name);
                return Ok(responseData);
            }
            catch (JourneyException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
