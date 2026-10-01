using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace ClaimProcessingAPI.Models
{
    public class Member
    {
        [Key]
        public int MemberId { get; set; }
        [Required]
        [StringLength(20)]
        public string MemberNumber { get; set; }
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; }
        [Required]
        [StringLength(50)]
        public string LastName { get; set; }
        [Column(TypeName = "date")]
        public DateTime DateOfBirth { get; set; }
        [StringLength(20)]
        public string? Gender { get; set; }
        [Required]
        [StringLength(100)]
        public string PlanName { get; set; }
        [Column(TypeName = "date")]
        public DateTime CoverageStartDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime CoverageEndDate { get; set; }
        [Required]
        [StringLength(20)]
        public string Status { get; set; }
        public ICollection<Claim> Claims { get; set; }
    }
}
