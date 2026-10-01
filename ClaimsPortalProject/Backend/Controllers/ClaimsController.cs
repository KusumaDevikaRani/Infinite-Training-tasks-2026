using ClaimProcessingAPI.Data;
using ClaimProcessingAPI.DTOs;
using ClaimProcessingAPI.Models;
using Microsoft.AspNetCore.Components.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Claim = ClaimProcessingAPI.Models.Claim;
namespace ClaimProcessingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClaimsController : ControllerBase
    {
        private readonly AppDbContext _context;
        // Constructor
        public ClaimsController(AppDbContext context)
        {
            _context = context;
        }
        // GET: api/claims
        [HttpGet]
        public async Task<IActionResult> GetClaims()
        {
            var claims = await _context.Claims
            .Include(c => c.Member)
            .Include(c => c.Provider)
            .Select(c => new ClaimDto
            {
                ClaimId = c.ClaimId,
                ClaimNumber = c.ClaimNumber,
                MemberName = c.Member.FirstName + " " + c.Member.LastName,
                ProviderName = c.Provider.ProviderName,
                ClaimType = c.ClaimType,
                ServiceDate = c.ServiceDate,
                BilledAmount = c.BilledAmount,
                AllowedAmount = c.AllowedAmount,
                PaidAmount = c.PaidAmount,
                Status = c.Status
            })
            .ToListAsync();
            return Ok(claims);
        }
        // GET: api/claims/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetClaim(int id)
        {
            var claim = await _context.Claims
            .Include(c => c.Member)
            .Include(c => c.Provider)
            .Include(c => c.ClaimLines)
            .Include(c => c.ClaimStatusHistories)
            .Include(c => c.Payments)
            .FirstOrDefaultAsync(c => c.ClaimId == id);
            if (claim == null)
            {
                return NotFound();
            }
            var result = new ClaimDetailDto
            {
                ClaimId = claim.ClaimId,
                ClaimNumber = claim.ClaimNumber,
                ClaimType = claim.ClaimType,
                ServiceDate = claim.ServiceDate,
                ReceivedDate = claim.ReceivedDate,
                Status = claim.Status,
                DenialReason = claim.DenialReason,
                MemberNumber = claim.Member.MemberNumber,
                MemberName = claim.Member.FirstName + " " + claim.Member.LastName,
                ProviderName = claim.Provider.ProviderName,
                NPI = claim.Provider.NPI,
                BilledAmount = claim.BilledAmount,
                AllowedAmount = claim.AllowedAmount,
                PaidAmount = claim.PaidAmount,
                MemberResponsibility = claim.MemberResponsibility,
                ClaimLines = claim.ClaimLines.Select(x => new ClaimLineDto
                {
                    ClaimLineId = x.ClaimLineId,
                    ProcedureCode = x.ProcedureCode,
                    DiagnosisCode = x.DiagnosisCode,
                    Units = x.Units,
                    BilledAmount = x.BilledAmount,
                    AllowedAmount = x.AllowedAmount,
                    PaidAmount = x.PaidAmount
                }).ToList(),
                StatusHistory = claim.ClaimStatusHistories.Select(x => new ClaimStatusHistoryDto
                {
                    HistoryId = x.HistoryId,
                    OldStatus = x.OldStatus,
                    NewStatus = x.NewStatus,
                    Comments = x.Comments,
                    ChangedBy = x.ChangedBy,
                    ChangedDate = x.ChangedDate
                }).ToList(),
                Payments = claim.Payments.Select(x => new PaymentDto
                {
                    PaymentId = x.PaymentId,
                    PaymentAmount = x.PaymentAmount,
                    PaymentDate = x.PaymentDate,
                    PaymentStatus = x.PaymentStatus,
                    PaymentReference = x.PaymentReference
                }).ToList()
            };
            return Ok(result);
        }
        // POST: api/claims
        [HttpPost]
        public async Task<IActionResult> CreateClaim(ClaimCreateDto dto)
        {


            // Check if member exists
            var member = await _context.Members
            .FirstOrDefaultAsync(m => m.MemberId == dto.MemberId);
            if (member == null)
            {
                return BadRequest("Member does not exist.");
            }
            // Check if provider exists
            var provider = await _context.Providers
            .FirstOrDefaultAsync(p => p.ProviderId == dto.ProviderId);
            if (provider == null)
            {
                return BadRequest("Provider does not exist.");
            }
            // Check duplicate claim number
            var existingClaim = await _context.Claims
            .FirstOrDefaultAsync(c => c.ClaimNumber == dto.ClaimNumber);
            if (existingClaim != null)
            {
                return BadRequest("Claim number already exists.");
            }

            decimal allowedAmount = dto.BilledAmount * 0.80m;

            decimal memberResponsibility =
                allowedAmount * 0.20m;

            var claim = new Claim
            {
                ClaimNumber = dto.ClaimNumber,
                MemberId = dto.MemberId,
                ProviderId = dto.ProviderId,
                ClaimType = dto.ClaimType,
                ServiceDate = dto.ServiceDate,
                ReceivedDate = DateTime.Now,
                BilledAmount = dto.BilledAmount,
                AllowedAmount = allowedAmount,
                PaidAmount = null,
                MemberResponsibility = memberResponsibility,
                Status = "Pending",
                DenialReason = null,
                CreatedDate = DateTime.Now
            };
            _context.Claims.Add(claim);
            await _context.SaveChangesAsync();


           

            foreach (var line in dto.ClaimLines)
            {
                var claimLine = new ClaimLine
                {
                    ClaimId = claim.ClaimId,
                    ProcedureCode = line.ProcedureCode,
                    DiagnosisCode = line.DiagnosisCode,
                    Units = line.Units,
                    BilledAmount = line.BilledAmount
                };

                _context.ClaimLines.Add(claimLine);
            }

            await _context.SaveChangesAsync();

            var statusHistory = new ClaimStatusHistory
            {
                ClaimId = claim.ClaimId,
                OldStatus = null,
                NewStatus = "Pending",
                Comments = "Claim created",
                ChangedBy = "System",
                ChangedDate = DateTime.Now
 

            };

            _context.ClaimStatusHistories.Add(statusHistory);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
            nameof(GetClaim),
            new { id = claim.ClaimId },
            claim
            );
        }
        // PUT: api/claims/1/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateClaimStatus(
        int id,
        ClaimStatusUpdateDto dto)
        {
            // Find claim
            var claim = await _context.Claims
            .FirstOrDefaultAsync(c => c.ClaimId == id);
            if (claim == null)
            {
                return NotFound("Claim not found.");
            }
            // Store old status
            var oldStatus = claim.Status;
            // Update claim status
            claim.Status = dto.NewStatus;

            if (dto.NewStatus.Equals("Paid", StringComparison.OrdinalIgnoreCase))
            {
                decimal paymentAmount =
                claim.AllowedAmount.GetValueOrDefault()
                - claim.MemberResponsibility.GetValueOrDefault();

                var payment = new Payment
                {
                    ClaimId = claim.ClaimId,
                    PaymentAmount = paymentAmount,
                    PaymentDate = DateTime.Now,
                    PaymentStatus = "Paid",
                    PaymentReference =
                $"PAY-{DateTime.Now:yyyyMMddHHmmss}"
                };

                _context.Payments.Add(payment);

                claim.PaidAmount = paymentAmount;
            }
            // Create status history record
            var history = new ClaimStatusHistory
            {
                ClaimId = claim.ClaimId,
                OldStatus = oldStatus,
                NewStatus = dto.NewStatus,
                Comments = dto.Comments,
                ChangedBy = dto.ChangedBy,
                ChangedDate = DateTime.Now
            };
            _context.ClaimStatusHistories.Add(history);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Claim status updated successfully.",
                claimId = claim.ClaimId,
                claimNumber = claim.ClaimNumber,
                oldStatus = oldStatus,
                newStatus = claim.Status
            });
        }
        //// PUT: api/claims/1/decision
        //[HttpPut("{id}/decision")]
        //public async Task<IActionResult> ProcessClaimDecision(
        // int id,
        // ClaimDecisionDto dto)
        //{
        // var claim = await _context.Claims
        // .FirstOrDefaultAsync(c => c.ClaimId == id);
        // if (claim == null)
        // {
        // return NotFound("Claim not found.");
        // }
        // if (dto.Decision != "Approved" && dto.Decision != "Denied")
        // {
        // return BadRequest("Decision must be Approved or Denied.");
        // }
        // var oldStatus = claim.Status;
        // if (dto.Decision == "Approved")
        // {
        // if (dto.AllowedAmount == null || dto.PaidAmount == null)
        // {
        // return BadRequest(
        // "AllowedAmount and PaidAmount are required for approval.");
        // }
        // claim.Status = "Approved";
        // claim.AllowedAmount = dto.AllowedAmount;
    }
}


