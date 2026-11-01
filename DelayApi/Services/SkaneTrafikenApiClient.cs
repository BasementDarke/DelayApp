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

        public Task<SkaneTrafikenPointsResponse?> GetPointsAsync(string stationName)
        {
            return _httpClient.GetFromJsonAsync<SkaneTrafikenPointsResponse>(
                $"Points?name={Uri.EscapeDataString(stationName)}",
                JsonOptions);
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
                    throw new Exception("Journey API response is nUll");
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
    }
}