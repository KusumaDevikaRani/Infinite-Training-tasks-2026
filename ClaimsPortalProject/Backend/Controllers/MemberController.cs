using ClaimPortal.DTOs;
using ClaimProcessingAPI.Data;
using ClaimProcessingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ClaimProcessingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MembersController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetMembers()
        {
            var members = await _context.Members
            .Select(m => new
            {
                memberId = m.MemberId,
                memberNumber = m.MemberNumber,
                firstName = m.FirstName,
                lastName = m.LastName,
                dateOfBirth = m.DateOfBirth,
                gender = m.Gender,
                planName = m.PlanName,
                coverageStartDate = m.CoverageStartDate,
                coverageEndDate = m.CoverageEndDate,
                status = m.Status
            })
            .ToListAsync();
            return Ok(members);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(int id)
        {
            var member = await _context.Members
            .FirstOrDefaultAsync(m => m.MemberId == id);
            if (member == null)
            {
                return NotFound("Member not found.");
            }
            return Ok(member);
        }


        [HttpPost]
        public async Task<IActionResult> AddMember(CreateMemberDto dto)
        {
            var existingMember = await _context.Members.FirstOrDefaultAsync(m => m.FirstName== dto.FirstName && m.LastName==dto.LastName && m.DateOfBirth==dto.DateofBirth);
            if (existingMember != null)
            {
                BadRequest("The member is already exists");
            }

            var member = new Member
            {
                //MemberNumber = dto.memberNumber,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                DateOfBirth = dto.DateofBirth,
                Gender = dto.Gender,
                PlanName = dto.Plan,
                CoverageStartDate = dto.CoverageStartDate,
                CoverageEndDate = dto.CoverageEndDate,
                Status = "Active"
            };

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            member.MemberNumber = $"MEM{member.MemberId:D4}";

            return Ok(member);
        }
    }
}