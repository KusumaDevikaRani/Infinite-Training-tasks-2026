using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ClaimProcessingAPI.Models
{
    public class ClaimLine
    {
        [Key]
        public int ClaimLineId { get; set; }
        public int ClaimId { get; set; }
        [Required]
        [StringLength(20)]
        public string ProcedureCode { get; set; }
        [Required]
        [StringLength(20)]
        public string DiagnosisCode { get; set; }
        public int Units { get; set; }
        [Column(TypeName = "decimal(12,2)")]
        public decimal BilledAmount { get; set; }
        [Column(TypeName = "decimal(12,2)")]
        public decimal? AllowedAmount { get; set; }
        [Column(TypeName = "decimal(12,2)")]
        public decimal? PaidAmount { get; set; }
        public Claim Claim { get; set; }
    }
}