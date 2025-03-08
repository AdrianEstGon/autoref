using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AutoRef_API.Database
{
    public class AppDataBase : IdentityDbContext<Usuario, ApplicationRole, string>
    {
        public AppDataBase(DbContextOptions<AppDataBase> options)
             : base(options)
        {
        }
        public DbSet<Partido> Partidos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Polideportivo> Polideportivos { get; set; }
        public DbSet<Disponibilidad> Disponibilidades { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer("Server=DESKTOP-TGGO9RR\\SQLEXPRESS;Database=AutoRef;Trusted_Connection=True;TrustServerCertificate=True;");

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Relación entre Partido y Polideportivo
            modelBuilder.Entity<Partido>()
                .HasOne<Polideportivo>()
                .WithMany()
                .HasForeignKey(p => p.LugarId);

            // Relación entre Partido y Usuarios
            modelBuilder.Entity<Partido>()
                .HasOne(p => p.Arbitro1)
                .WithMany()
                .HasForeignKey(p => p.Arbitro1Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Partido>()
                .HasOne(p => p.Arbitro2)
                .WithMany()
                .HasForeignKey(p => p.Arbitro2Id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Partido>()
                .HasOne(p => p.Anotador)
                .WithMany()
                .HasForeignKey(p => p.AnotadorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación entre Disponibilidad y Usuario
            modelBuilder.Entity<Disponibilidad>()
                .HasOne(d => d.Usuario)
                .WithMany()
                .HasForeignKey(d => d.UsuarioId);

            // Configuración de las propiedades de las entidades
            modelBuilder.Entity<Partido>()
                .Property(p => p.Id)
                .ValueGeneratedOnAdd();      

            modelBuilder.Entity<Polideportivo>()
                .Property(p => p.Id)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Disponibilidad>()
                .Property(d => d.Id)
                .ValueGeneratedOnAdd();

            // Configuración de las entidades de Identity
            modelBuilder.Entity<IdentityUserLogin<string>>().HasKey(iul => new { iul.LoginProvider, iul.ProviderKey });
            modelBuilder.Entity<IdentityUserRole<string>>().HasKey(iur => new { iur.UserId, iur.RoleId });
            modelBuilder.Entity<IdentityUserToken<string>>().HasKey(iut => new { iut.UserId, iut.LoginProvider, iut.Name });
        }

    }
}
