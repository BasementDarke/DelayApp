using DelayApi.Exceptions;
using DelayApi.Models;
using System.Text.Json;

namespace DelayApi.Services
{
    public sealed class JourneyService
    {
        private readonly SkaneTrafikenApiClient _apiClient;
        private readonly ILogger<JourneyService> _logger;

        public JourneyService(SkaneTrafikenApiClient apiClient, ILogger<JourneyService> logger)
        {
            _apiClient = apiClient;
            _logger = logger;
        }

        public async Task<JourneyResponse> SearchAsync(string departureStation, string arrivalStation, int taskKey)
        {
            var fromPoint = await FindPointAsync(departureStation, "departure", taskKey);
            var toPoint = await FindPointAsync(arrivalStation, "arrival", taskKey);

            return await _apiClient.GetJourneysAsync(fromPoint, toPoint);

        }

        public async Task<SkaneTrafikenPointsResponse> AutocompletePoints(string stationName)
        {
            return await _apiClient.GetPointsAsync(stationName);
        }

        private async Task<SkaneTrafikenPoint> FindPointAsync(string stationName, string stationRole, int taskKey)
        {
            var normalizedName = NormalizeStationName(stationName);

            SkaneTrafikenPointsResponse? pointsResponse;
            try
            {
                pointsResponse = await _apiClient.GetPointsAsync(normalizedName);
            }
            catch (HttpRequestException exception)
            {
                _logger.LogError(exception, "Points API request failed for the {StationRole} point lookup in task {TaskKey} with status {StatusCode}.", stationRole, taskKey, exception.StatusCode);
                throw;
            }
            catch (JsonException exception)
            {
                _logger.LogError(exception, "Could not parse the Points API response for the {StationRole} point lookup in task {TaskKey}.", stationRole, taskKey);
                throw;
            }

            if (pointsResponse?.Error is { } apiError)
            {
                _logger.LogError("Points API returned error {ErrorCode} for the {StationRole} point lookup in task {TaskKey}: {ErrorMessage}", apiError.Code, stationRole, taskKey, apiError.Message);
                throw new JourneyException($"Could not locate station {stationName}");
            }

            var points = pointsResponse?.Points ?? [];

            var matchingPoint = points.FirstOrDefault(point =>
                                    string.Equals(NormalizeStationName(point.Name), normalizedName, StringComparison.OrdinalIgnoreCase) &&
                                    string.Equals(point.Type, "STOP_AREA", StringComparison.OrdinalIgnoreCase))
                                ?? points.FirstOrDefault(point =>
                                    string.Equals(NormalizeStationName(point.Name), normalizedName, StringComparison.OrdinalIgnoreCase));

            if (matchingPoint is null)
            {
                _logger.LogWarning("Points API returned no exact {StationRole} match for task {TaskKey} ({CandidateCount} candidates).", stationRole, taskKey, points.Count);
                throw new JourneyException($"Could not locate station {stationName}");
            }

            return matchingPoint;
        }

        private static string NormalizeStationName(string stationName)
        {
            return string.Concat(stationName.Where(character => !char.IsWhiteSpace(character)));
        }

    }
}
