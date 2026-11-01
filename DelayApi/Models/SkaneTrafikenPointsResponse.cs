namespace DelayApi.Models
{
    public sealed class SkaneTrafikenPointsResponse
    {
        public List<SkaneTrafikenPoint> Points { get; set; } = [];
        public SkaneTrafikenApiError? Error { get; set; }
    }

    public sealed class SkaneTrafikenApiError
    {
        public string? Code { get; set; }
        public string? Message { get; set; }
    }

    public sealed class SkaneTrafikenPoint
    {
        public string Id2 { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }
}