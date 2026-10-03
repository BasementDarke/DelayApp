namespace DelayApi.Models
{
    public class JourneyResponse
    {
        public string? Api { get; set; }
        public DateTime Time { get; set; }
        public int Id { get; set; }
        public Dictionary<int, Journey>[]? Journeys { get; set; }
    }

    public class Journey
    {
        public int Id { get; set; }
        public string? JourneyKey { get; set; }
        public Dictionary<int, RouteLink>[]? RouteLinks { get; set; }
    }

    public class RouteLink 
    { 
        public int Id { get; set; }
        public Dictionary<string, RouteStation>? From { get; set; }
        public Dictionary<string, RouteStation>? To { get; set; }
        public Dictionary<string, RouteLine>? Line { get; set; }
    }

    public class RouteStation
    {
        public string? Name { get; set; }
        public DateTime Time { get; set; }
        public int Deviation { get; set; } // If train is delayed this field will appear
        public bool Passed { get; set; } // If train has passed this field will appear
    }

    public class RouteLine 
    { 
        public string? Name { get; set; }
        public string? Type { get; set; }
        public string? No { get; set; } // If train this will show, will not show for bus
        public int LineNo { get; set; } // If trian this will show, will show for bus
    }
}
