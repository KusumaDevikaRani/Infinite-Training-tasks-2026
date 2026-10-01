using System.ComponentModel.DataAnnotations;
namespace ClaimProcessingAPI.Models
{
    public class Provider
    {
        [Key]
        public int ProviderId { get; set; }
        [Required]
        [StringLength(20)]
        public string NPI { get; set; }
        [Required]
        [StringLength(150)]
        public string ProviderName { get; set; }
        [StringLength(100)]
        public string? Specialty { get; set; }
        [StringLength(250)]
        public string? Address { get; set; }
        [Required]
        [StringLength(20)]
        public string Status { get; set; }
        public ICollection<Claim> Claims { get; set; }
    }
}