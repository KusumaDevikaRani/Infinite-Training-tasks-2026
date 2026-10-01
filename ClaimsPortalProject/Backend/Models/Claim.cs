using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ClaimProcessingAPI.Models
{
    public class Claim
    {
        [Key]
        public int ClaimId { get; set; }
        [Required]
        [StringLength(30)]
        public string ClaimNumber { get; set; }
        // Foreign key to Member
        public int MemberId { get; set; }
        // Foreign key to Provider
        public int ProviderId { get; set; }
        [Required]
        [StringLength(30)]
        public string ClaimType { get; set; }
        [Column(TypeName = "date")]
        public DateTime ServiceDate { get; set; }
        public DateTime ReceivedDate { get; set; }
        [Column(TypeName = "decimal(12,2)")]
        public decimal BilledAmount { get; set; }
        [Column(TypeName = "decimal(12,2)")]
        public decimal? AllowedAmount { get; set; }
        [Column(TypeName = "decimal(12,2)")]
        public decimal? PaidAmount { get; set; }
        [Column(TypeName = "decimal(12,2)")]
        public decimal? MemberResponsibility { get; set; }
        [Required]
        [StringLength(30)]
        public string Status { get; set; }
        [StringLength(500)]
        public string? DenialReason { get; set; }
        public DateTime CreatedDate { get; set; }
        // Navigation properties
        public Member Member { get; set; }
        public Provider Provider { get; set; }
        public ICollection<ClaimLine> ClaimLines { get; set; }
        public ICollection<ClaimStatusHistory> ClaimStatusHistories { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}