using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using System;

namespace AutoRef_API.Database
{
    public class AppDataBase : IdentityDbContext<Usuario, ApplicationRole, Guid>
    {
        public AppDataBase(DbContextOptions<AppDataBase> options)
             : base(options)
        {
        }

        public DbSet<Partido> Partidos { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Polideportivo> Polideportivos { get; set; }
        public DbSet<Disponibilidad> Disponibilidades { get; set; }
        public DbSet<Equipo> Equipos { get; set; }
        public DbSet<Club> Clubs { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Notificacion> Notificaciones { get; set; }
        public DbSet<Competicion> Competiciones { get; set; }
        public DbSet<Persona> Personas { get; set; }
        public DbSet<Inscripcion> Inscripciones { get; set; }
        public DbSet<EnvioMutua> EnviosMutua { get; set; }
        public DbSet<EnvioMutuaItem> EnviosMutuaItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); 

            // Configurar claves GUID (MySQL genera GUIDs en la aplicación, no en la BD)
            modelBuilder.Entity<Usuario>().Property(u => u.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<ApplicationRole>().Property(r => r.Id).ValueGeneratedOnAdd();

            // Relaciones de Identity con GUID
            modelBuilder.Entity<IdentityUserRole<Guid>>().HasKey(iur => new { iur.UserId, iur.RoleId });
            modelBuilder.Entity<IdentityUserLogin<Guid>>().HasKey(iul => new { iul.LoginProvider, iul.ProviderKey });
            modelBuilder.Entity<IdentityUserToken<Guid>>().HasKey(iut => new { iut.UserId, iut.LoginProvider, iut.Name });

            // Relación entre Notificacion y Usuario
            modelBuilder.Entity<Notificacion>()
                .HasOne(n => n.Usuario)
                .WithMany()
                .HasForeignKey(n => n.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación entre Partido y Polideportivo
            modelBuilder.Entity<Partido>()
                .HasOne(p => p.Lugar)
                .WithMany()
                .HasForeignKey(p => p.LugarId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);

            modelBuilder.Entity<Usuario>().ToTable("Usuarios");

            // Relación entre Equipo y Club
            modelBuilder.Entity<Equipo>()
                .HasOne(e => e.Club)
                .WithMany()
                .HasForeignKey(e => e.ClubId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación entre Usuario y Club
            modelBuilder.Entity<Usuario>()
                .HasOne(u => u.ClubVinculado)
                .WithMany()
                .HasForeignKey(u => u.ClubVinculadoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relación entre Equipo y Categoria
            modelBuilder.Entity<Equipo>()
                .HasOne(e => e.Categoria)
                .WithMany()
                .HasForeignKey(e => e.CategoriaId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relaciones de Partido con Equipo y Árbitros
            modelBuilder.Entity<Partido>()
                .HasOne(p => p.EquipoLocal)
                .WithMany()
                .HasForeignKey(p => p.EquipoLocalId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            modelBuilder.Entity<Partido>()
                .HasOne(p => p.EquipoVisitante)
                .WithMany()
                .HasForeignKey(p => p.EquipoVisitanteId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            modelBuilder.Entity<Partido>()
                .HasOne(p => p.Arbitro1)
                .WithMany()
                .HasForeignKey(p => p.Arbitro1Id)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            modelBuilder.Entity<Partido>()
                .HasOne(p => p.Arbitro2)
                .WithMany()
                .HasForeignKey(p => p.Arbitro2Id)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            modelBuilder.Entity<Partido>()
                .HasOne(p => p.Anotador)
                .WithMany()
                .HasForeignKey(p => p.AnotadorId)
                .OnDelete(DeleteBehavior.Restrict)
                .IsRequired(false);

            // Relación entre Disponibilidad y Usuario
            modelBuilder.Entity<Disponibilidad>()
                .HasOne(d => d.Usuario)
                .WithMany()
                .HasForeignKey(d => d.UsuarioId);

            // Configurar IDs como valores generados automáticamente
            modelBuilder.Entity<Partido>().Property(p => p.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Polideportivo>().Property(p => p.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Disponibilidad>().Property(d => d.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Equipo>().Property(e => e.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Club>().Property(c => c.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Categoria>().Property(c => c.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Competicion>().Property(c => c.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Persona>().Property(p => p.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Inscripcion>().Property(i => i.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<EnvioMutua>().Property(e => e.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<EnvioMutuaItem>().Property(e => e.Id).ValueGeneratedOnAdd();

            modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Licencia)
            .IsUnique();

            // Persona: documento único
            modelBuilder.Entity<Persona>()
                .HasIndex(p => p.Documento)
                .IsUnique();

            // Inscripción: evitar duplicados exactos (misma persona en mismo equipo+competición)
            modelBuilder.Entity<Inscripcion>()
                .HasIndex(i => new { i.PersonaId, i.EquipoId, i.CompeticionId })
                .IsUnique();

            modelBuilder.Entity<Inscripcion>()
                .HasOne(i => i.Persona)
                .WithMany()
                .HasForeignKey(i => i.PersonaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Inscripcion>()
                .HasOne(i => i.Equipo)
                .WithMany()
                .HasForeignKey(i => i.EquipoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Inscripcion>()
                .HasOne(i => i.Competicion)
                .WithMany()
                .HasForeignKey(i => i.CompeticionId)
                .OnDelete(DeleteBehavior.Cascade);

            // Envíos a mutua
            modelBuilder.Entity<EnvioMutua>()
                .HasMany(e => e.Items)
                .WithOne(i => i.EnvioMutua)
                .HasForeignKey(i => i.EnvioMutuaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<EnvioMutuaItem>()
                .HasOne(i => i.Inscripcion)
                .WithMany()
                .HasForeignKey(i => i.InscripcionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Persona>()
                .HasOne(p => p.UltimoEnvioMutua)
                .WithMany()
                .HasForeignKey(p => p.UltimoEnvioMutuaId)
                .OnDelete(DeleteBehavior.SetNull);
        }


    }
}
