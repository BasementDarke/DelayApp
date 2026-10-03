namespace DelayApi.Models
{
    public class JourneyResponse
    {
        public string Api { get; set; } = string.Empty;
        public DateTime Time { get; set; }
        public string Id { get; set; } = string.Empty;
        public List<Journey> Journeys { get; set; } = [];
    }

    public class Journey
    {
        public int Id { get; set; }
        public string JourneyKey { get; set; } = string.Empty;
        public List<RouteLink> RouteLinks { get; set; } = [];
    }

    public class RouteLink
    {
        public string? Id { get; set; }
        public RouteStation? From { get; set; }
        public RouteStation? To { get; set; }
        public RouteLine Line { get; set; } = new();
    }


    public class RouteStation
    {
        public string Name { get; set; } = string.Empty;
        public DateTime Time { get; set; }
        public int? Deviation { get; set; } // If train is delayed this field will appear
        public bool? Passed { get; set; } // If train has passed this field will appear
    }

    public class RouteLine
    {
        public string Name { get; set; } = string.Empty;
        public string? Type { get; set; }
        public string? No { get; set; } // If train this will show, will not show for bus
        public int? LineNo { get; set; } // If trian this will show, will show for bus
    }
}

