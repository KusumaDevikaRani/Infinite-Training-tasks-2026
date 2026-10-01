using ClaimProcessingAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ClaimProcessingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            var totalClaims = await _context.Claims.CountAsync();
            var pendingClaims = await _context.Claims
            .CountAsync(c => c.Status == "Pending");
            var approvedClaims = await _context.Claims
            .CountAsync(c => c.Status == "Approved");
            var deniedClaims = await _context.Claims
            .CountAsync(c => c.Status == "Denied");
            var paidClaims = await _context.Claims
            .CountAsync(c => c.Status == "Paid");
            var underReviewClaims = await _context.Claims
            .CountAsync(c => c.Status == "Under Review");
            var totalBilledAmount = await _context.Claims
            .SumAsync(c => (decimal?)c.BilledAmount) ?? 0;
            var totalPaidAmount = await _context.Claims
            .SumAsync(c => (decimal?)c.PaidAmount) ?? 0;
            var totalMembers = await _context.Members.CountAsync();
            var totalProviders = await _context.Providers.CountAsync();
            return Ok(new
            {
                totalClaims,
                pendingClaims,
                approvedClaims,
                deniedClaims,
                paidClaims,
                underReviewClaims,
                totalBilledAmount,
                totalPaidAmount,
                totalMembers,
                totalProviders
            });
        }
    }
}
