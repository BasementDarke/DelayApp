namespace DelayApi.Models
{
    public class JourneySearch
    {
        public int TaskKey { get; set; }
        public string? DepartureStation { get; set; }
        public string? ArrivalStation { get; set; }
    };
}
