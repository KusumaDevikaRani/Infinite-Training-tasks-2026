using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ClaimProcessingAPI.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }
        public int ClaimId { get; set; }
        [Column(TypeName = "decimal(12,2)")]
        public decimal PaymentAmount { get; set; }
        public DateTime? PaymentDate { get; set; }
        [Required]
        [StringLength(30)]
        public string PaymentStatus { get; set; }
        [StringLength(50)]
        public string? PaymentReference { get; set; }
        public Claim Claim { get; set; }
    }
}
