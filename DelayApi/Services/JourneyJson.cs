using DelayApi.Models;
using System.Text.Json;

namespace DelayApi.Services
{
    public class JourneyJson
    {
        JourneyJson()
        {
            string jsonString = "Test";
            JourneyResponse? test = JsonSerializer.Deserialize<JourneyResponse>(jsonString);
        }
    }
}
/*
 * Info for how I am parsing JSON
 https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/deserialization

See Models.JourneyResponse for Json Structure

 */
