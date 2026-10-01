using System.ComponentModel.DataAnnotations.Schema;

namespace ClaimPortal.DTOs
{
    public class CreateMemberDto
    {
        //public string memberNumber { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateTime DateofBirth { get; set; }

        public string Gender { get; set; }

        public string Plan { get; set; }

        public DateTime CoverageStartDate { get; set; }
      
        public DateTime CoverageEndDate { get; set; }

        public string Status { get; set; }
    }
}
