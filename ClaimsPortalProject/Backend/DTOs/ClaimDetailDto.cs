namespace ClaimProcessingAPI.DTOs
{
    public class ClaimDetailDto
    {
        public int ClaimId { get; set; }
        public string ClaimNumber { get; set; }
        public string ClaimType { get; set; }
        public DateTime ServiceDate { get; set; }
        public DateTime ReceivedDate { get; set; }
        public string Status { get; set; }
        public string? DenialReason { get; set; }
        public string MemberNumber { get; set; }
        public string MemberName { get; set; }
        public string ProviderName { get; set; }
        public string NPI { get; set; }
        public decimal BilledAmount { get; set; }
        public decimal? AllowedAmount { get; set; }
        public decimal? PaidAmount { get; set; }

        public decimal? MemberResponsibility { get; set; }
        public List<ClaimLineDto> ClaimLines { get; set; }
        public List<ClaimStatusHistoryDto> StatusHistory { get; set; }
        public List<PaymentDto> Payments { get; set; }
    }
    public class ClaimLineDto
    {
        public int ClaimLineId { get; set; }
        public string ProcedureCode { get; set; }
        public string DiagnosisCode { get; set; }
        public int Units { get; set; }
        public decimal BilledAmount { get; set; }
        public decimal? AllowedAmount { get; set; }
        public decimal? PaidAmount { get; set; }
    }
    public class ClaimStatusHistoryDto
    {
        public int HistoryId { get; set; }
        public string? OldStatus { get; set; }
        public string NewStatus { get; set; }
        public string? Comments { get; set; }
        public string ChangedBy { get; set; }
        public DateTime ChangedDate { get; set; }
    }
    public class PaymentDto
    {
        public int PaymentId { get; set; }
        public decimal PaymentAmount { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string PaymentStatus { get; set; }
        public string? PaymentReference { get; set; }

    }
}