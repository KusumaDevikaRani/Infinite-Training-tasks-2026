using ClaimProcessingAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using System.Security.Claims;
using Claim = ClaimProcessingAPI.Models.Claim;
namespace ClaimProcessingAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
        }
        // Tables
        public DbSet<Member> Members { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<Claim> Claims { get; set; }
        public DbSet<ClaimLine> ClaimLines { get; set; }
        public DbSet<ClaimStatusHistory> ClaimStatusHistories { get; set; }
        public DbSet<Payment> Payments { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Member configuration
            modelBuilder.Entity<Member>()
            .ToTable("Members");
            // Provider configuration
            modelBuilder.Entity<Provider>()
            .ToTable("Providers");
            // Claim configuration
            modelBuilder.Entity<Claim>()
            .ToTable("Claims");
            // ClaimLine configuration
            modelBuilder.Entity<ClaimLine>()
            .ToTable("ClaimLines");
            // ClaimStatusHistory configuration
            modelBuilder.Entity<ClaimStatusHistory>()
            .ToTable("ClaimStatusHistory");
            // Payment configuration
            modelBuilder.Entity<Payment>()
            .ToTable("Payments");

            // Member → Claims
            modelBuilder.Entity<Claim>()
            .HasOne(c => c.Member)
            .WithMany(m => m.Claims)
            .HasForeignKey(c => c.MemberId)
            .OnDelete(DeleteBehavior.Restrict);
            // Provider → Claims
            modelBuilder.Entity<Claim>()
            .HasOne(c => c.Provider)
            .WithMany(p => p.Claims)
            .HasForeignKey(c => c.ProviderId)
            .OnDelete(DeleteBehavior.Restrict);
            // Claim → ClaimLines
            modelBuilder.Entity<ClaimLine>()
            .HasOne(cl => cl.Claim)
            .WithMany(c => c.ClaimLines)
            .HasForeignKey(cl => cl.ClaimId)
            .OnDelete(DeleteBehavior.Cascade);
            // Claim → Status History
            modelBuilder.Entity<ClaimStatusHistory>()
            .HasOne(h => h.Claim)
            .WithMany(c => c.ClaimStatusHistories)
            .HasForeignKey(h => h.ClaimId)
            .OnDelete(DeleteBehavior.Cascade);
            // Claim → Payments
            modelBuilder.Entity<Payment>()
            .HasOne(p => p.Claim)
            .WithMany(c => c.Payments)
            .HasForeignKey(p => p.ClaimId)
            .OnDelete(DeleteBehavior.Cascade);
            // Unique MemberNumber
            modelBuilder.Entity<Member>()
            .HasIndex(m => m.MemberNumber)
            .IsUnique();
            // Unique NPI
            modelBuilder.Entity<Provider>()
            .HasIndex(p => p.NPI)
            .IsUnique();
            // Unique ClaimNumber
            modelBuilder.Entity<Claim>()
            .HasIndex(c => c.ClaimNumber)
            .IsUnique();
        }
    }
}

