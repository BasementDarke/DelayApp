using DelayApi.Models;
using System.Net.Http.Json;
using System.Text.Json;

namespace DelayApi.Services
{
    public sealed class SkaneTrafikenApiClient
    {
        private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
        private readonly HttpClient _httpClient;

        public SkaneTrafikenApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<SkaneTrafikenPointsResponse> GetPointsAsync(string stationName)
        {
            using var response = await _httpClient.GetAsync(BuildPointsRequest(stationName));
            response.EnsureSuccessStatusCode();

            try
            {
                var pointsResponse = await response.Content.ReadFromJsonAsync<SkaneTrafikenPointsResponse>(JsonOptions);
                if(pointsResponse == null)
                {
                    throw new Exception("Points API response is null");
                }
                return pointsResponse;
            }
            catch
            {
                throw;
            }

        }

        public async Task<JourneyResponse> GetJourneysAsync(SkaneTrafikenPoint fromPoint, SkaneTrafikenPoint toPoint)
        {
            using var response = await _httpClient.GetAsync(BuildJourneyRequest(fromPoint, toPoint));
            response.EnsureSuccessStatusCode();

            try
            {
                var journeyResponse = await response.Content.ReadFromJsonAsync<JourneyResponse>(JsonOptions);
                if(journeyResponse == null)
                {
                    throw new Exception("Journey API response is null");
                }
                var prevCursor = journeyResponse.PrevCursor;
                var prevResponse = await this.GetPrevJourneysAsync(fromPoint, toPoint, prevCursor);
                var prevJourneys = prevResponse.Journeys;
                var journeys = journeyResponse.Journeys;
                for(var i = 0; i < prevJourneys.Count; i++)
                {
                    journeys.Add(prevJourneys[i]);
                }
                journeyResponse.Journeys = journeys;
                return journeyResponse;

            }
            catch
            {
                throw;
            }
        }

        public async Task<JourneyResponse> GetPrevJourneysAsync(SkaneTrafikenPoint fromPoint, SkaneTrafikenPoint toPoint, string prevCursor)
        {
            using var response = await _httpClient.GetAsync(BuildPrevJourneyRequest(fromPoint, toPoint, prevCursor));
            response.EnsureSuccessStatusCode();

            try
            {
                var journeyResponse = await response.Content.ReadFromJsonAsync<JourneyResponse>(JsonOptions);
                if (journeyResponse == null)
                {
                    throw new Exception("Journey API response is null");
                }
                return journeyResponse;

            }
            catch
            {
                throw;
            }
        }

        private static string BuildJourneyRequest(SkaneTrafikenPoint fromPoint, SkaneTrafikenPoint toPoint)
        {
            return "Journey?" +
                   $"fromPointId={Uri.EscapeDataString(fromPoint.Id2)}" +
                   $"&fromPointType={Uri.EscapeDataString(fromPoint.Type)}" +
                   $"&toPointId={Uri.EscapeDataString(toPoint.Id2)}" +
                   $"&toPointType={Uri.EscapeDataString(toPoint.Type)}" +
                   "&arrival=false" +
                   "&priority=SHORTEST_TIME" +
                   "&isBobCapable=false" +
                   "&journeysAfter=4" +
                   "&walkSpeed=NORMAL" +
                   "&maxWalkDistance=2000" +
                   "&allowWalkToOtherStop=true";
        }

        private static string BuildPrevJourneyRequest(SkaneTrafikenPoint fromPoint, SkaneTrafikenPoint toPoint, string prevCursor)
        {
            DateTime currDate = DateTime.Now;
            DateTime rounded = new DateTime(currDate.Year, currDate.Month, currDate.Day, currDate.Hour, currDate.Minute, 0);
            var test = rounded.ToString("yyyy-MM-ddTHH:mm:ssKZ"); 
            // Might need to subtract a couple of minutes from the time

            return "Journey?" +
                   $"fromPointId={Uri.EscapeDataString(fromPoint.Id2)}" +
                   $"&fromPointType={Uri.EscapeDataString(fromPoint.Type)}" +
                   $"&toPointId={Uri.EscapeDataString(toPoint.Id2)}" +
                   $"&toPointType={Uri.EscapeDataString(toPoint.Type)}" +
                   $"&journeyDateTime={Uri.EscapeDataString(test)}" +
                   "&arrival=true" +
                   "&priority=SHORTEST_TIME" +
                   "&isBobCapable=false" +
                   "&journeysAfter=4" +
                   "&walkSpeed=NORMAL" +
                   "&maxWalkDistance=2000" +
                   "&allowWalkToOtherStop=true" +
                   $"&prevCursor={Uri.EscapeDataString(prevCursor)}";
        }

        private static string BuildPointsRequest(string stationName)
        {
            return $"Points?name={Uri.EscapeDataString(stationName)}";
        }
    }
}