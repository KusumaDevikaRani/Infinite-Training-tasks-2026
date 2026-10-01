namespace ClaimProcessingAPI.DTOs
{
    public class ClaimStatusUpdateDto
    {
        public string NewStatus { get; set; }
        public string? Comments { get; set; }
        public string ChangedBy { get; set; }
    }
}
