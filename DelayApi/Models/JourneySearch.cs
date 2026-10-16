namespace DelayApi.Models
{
    public class JourneySearch
    {
        public required int TaskKey { get; set; }
        public required string? DepartureStation { get; set; }
        public required string? ArrivalStation { get; set; }
    };
}
