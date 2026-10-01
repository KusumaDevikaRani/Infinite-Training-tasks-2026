using System.ComponentModel.DataAnnotations;
namespace ClaimProcessingAPI.Models
{
    public class ClaimStatusHistory
    {
        [Key]
        public int HistoryId { get; set; }
        public int ClaimId { get; set; }
        [StringLength(30)]
        public string? OldStatus { get; set; }
        [Required]
        [StringLength(30)]
        public string NewStatus { get; set; }
        [StringLength(500)]
        public string? Comments { get; set; }
        [Required]
        [StringLength(100)]
        public string ChangedBy { get; set; }
        public DateTime ChangedDate { get; set; }
        public Claim Claim { get; set; }
    }
}