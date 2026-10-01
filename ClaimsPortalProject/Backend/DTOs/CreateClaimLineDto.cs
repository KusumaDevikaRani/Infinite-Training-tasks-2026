public class CreateClaimLineDto
{
    public string ProcedureCode { get; set; } = string.Empty;

    public string DiagnosisCode { get; set; } = string.Empty;

    public int Units { get; set; }

    public decimal BilledAmount { get; set; }


}