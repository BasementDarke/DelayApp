using System.ComponentModel.DataAnnotations;

namespace DelayApi.Models
{
    public class JourneySearch
    {
        public required int TaskKey { get; set; }

        [Required]
        public required string DepartureStation { get; set; }

        [Required]
        public required string ArrivalStation { get; set; }
    };
}
