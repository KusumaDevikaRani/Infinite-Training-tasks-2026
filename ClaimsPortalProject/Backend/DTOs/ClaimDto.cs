namespace ClaimProcessingAPI.DTOs
{
    public class ClaimDto
    {
        public int ClaimId { get; set; }
        public string ClaimNumber { get; set; }
        public string MemberName { get; set; }
        public string ProviderName { get; set; }
        public string ClaimType { get; set; }
        public DateTime ServiceDate { get; set; }
        public decimal BilledAmount { get; set; }
        public decimal? AllowedAmount { get; set; }

        public decimal? MemberResponsibility { get; set; }
        public decimal? PaidAmount { get; set; }
        public string Status { get; set; }
    }
}