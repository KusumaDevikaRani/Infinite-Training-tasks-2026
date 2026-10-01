using ClaimProcessingAPI.Data;
using ClaimProcessingAPI.Models;
using ClaimProcessingAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClaimPortal.DTOs;
namespace ClaimProcessingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProvidersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProvidersController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetProviders()
        {
            var providers = await _context.Providers
            .Select(p => new
            {
                providerId = p.ProviderId,
                npi = p.NPI,
                providerName = p.ProviderName,
                specialty = p.Specialty,
                address = p.Address,
                status = p.Status
            })
            .ToListAsync();
            return Ok(providers);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProvider(int id)
        {
            var provider = await _context.Providers
            .FirstOrDefaultAsync(p => p.ProviderId == id);
            if (provider == null)
            {
                return NotFound("Provider not found.");
            }
            return Ok(provider);
        }

        [HttpPost]
        public async Task<IActionResult> AddProvider(ProviderCreateDto dto)
        {
            var existingProvider=await _context.Providers.FirstOrDefaultAsync(p => p.NPI==dto.Npi);
            if (existingProvider != null) {
                return BadRequest("Provider with this NPI already exists");
            }

            var provider = new Provider
            {
                NPI = dto.Npi,
                ProviderName = dto.ProviderName,
                Specialty = dto.specialty,
                Address =dto.Address,
                Status=dto.Status
            };

            _context.Providers.Add(provider);
            await _context.SaveChangesAsync();

            return Ok(provider);
        }
    }
}