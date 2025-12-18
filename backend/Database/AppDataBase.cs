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
        public DbSet<Federacion> Federaciones { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Notificacion> Notificaciones { get; set; }
        public DbSet<Competicion> Competiciones { get; set; }
        public DbSet<Persona> Personas { get; set; }
        public DbSet<Temporada> Temporadas { get; set; }
        public DbSet<Modalidad> Modalidades { get; set; }
        public DbSet<LicenciaPersona> LicenciasPersonas { get; set; }
        public DbSet<LicenciaCategoriaHabilitada> LicenciasCategoriasHabilitadas { get; set; }
        public DbSet<Inscripcion> Inscripciones { get; set; }
        public DbSet<EnvioMutua> EnviosMutua { get; set; }
        public DbSet<EnvioMutuaItem> EnviosMutuaItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); 

            // Seed IDs (estables) - actualmente solo existe una federación (Asturiana)
            var federacionAsturianaId = SeedIds.FederacionAsturianaId;

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

            // Relación entre Equipo y Competición (equipos por competición)
            modelBuilder.Entity<Equipo>()
                .HasOne(e => e.Competicion)
                .WithMany()
                .HasForeignKey(e => e.CompeticionId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relación entre Club y Federación
            modelBuilder.Entity<Club>()
                .HasOne(c => c.Federacion)
                .WithMany()
                .HasForeignKey(c => c.FederacionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Club>()
                .Property(c => c.FederacionId)
                .HasDefaultValue(federacionAsturianaId);

            // Relación entre Competición y Federación
            modelBuilder.Entity<Competicion>()
                .HasOne(c => c.Federacion)
                .WithMany()
                .HasForeignKey(c => c.FederacionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Competicion>()
                .Property(c => c.FederacionId)
                .HasDefaultValue(federacionAsturianaId);

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
            modelBuilder.Entity<Federacion>().Property(f => f.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Categoria>().Property(c => c.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Competicion>().Property(c => c.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Persona>().Property(p => p.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Temporada>().Property(t => t.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Modalidad>().Property(m => m.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<LicenciaPersona>().Property(l => l.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<LicenciaCategoriaHabilitada>().Property(l => l.Id).ValueGeneratedOnAdd();
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

            // Temporada: nombre único
            modelBuilder.Entity<Temporada>()
                .HasIndex(t => t.Nombre)
                .IsUnique();

            // Modalidad: nombre único
            modelBuilder.Entity<Modalidad>()
                .HasIndex(m => m.Nombre)
                .IsUnique();

            // Licencia: una por persona+temporada+modalidad
            modelBuilder.Entity<LicenciaPersona>()
                .HasIndex(l => new { l.PersonaId, l.TemporadaId, l.ModalidadId })
                .IsUnique();

            // Categorías habilitadas: evitar duplicados por licencia
            modelBuilder.Entity<LicenciaCategoriaHabilitada>()
                .HasIndex(x => new { x.LicenciaPersonaId, x.CategoriaId })
                .IsUnique();

            // Inscripción: evitar duplicados exactos (misma persona en mismo equipo+competición)
            modelBuilder.Entity<Inscripcion>()
                .HasIndex(i => new { i.PersonaId, i.EquipoId, i.CompeticionId })
                .IsUnique();

            // Federación: nombre único
            modelBuilder.Entity<Federacion>()
                .HasIndex(f => f.Nombre)
                .IsUnique();

            // Club: nombre único dentro de la federación
            modelBuilder.Entity<Club>()
                .HasIndex(c => new { c.FederacionId, c.Nombre })
                .IsUnique();

            // Club: CIF único dentro de la federación (si viene informado)
            modelBuilder.Entity<Club>()
                .HasIndex(c => new { c.FederacionId, c.CIF })
                .IsUnique();

            // Competición: nombre único dentro de la federación
            modelBuilder.Entity<Competicion>()
                .HasIndex(c => new { c.FederacionId, c.Nombre })
                .IsUnique();

            // Equipo: evitar duplicados por club+competición+categoría+nombre
            modelBuilder.Entity<Equipo>()
                .HasIndex(e => new { e.ClubId, e.CompeticionId, e.CategoriaId, e.Nombre })
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

            // Licencias
            modelBuilder.Entity<LicenciaPersona>()
                .HasOne(l => l.Persona)
                .WithMany()
                .HasForeignKey(l => l.PersonaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LicenciaPersona>()
                .HasOne(l => l.Temporada)
                .WithMany()
                .HasForeignKey(l => l.TemporadaId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LicenciaPersona>()
                .HasOne(l => l.Modalidad)
                .WithMany()
                .HasForeignKey(l => l.ModalidadId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<LicenciaPersona>()
                .HasOne(l => l.CategoriaBase)
                .WithMany()
                .HasForeignKey(l => l.CategoriaBaseId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<LicenciaPersona>()
                .HasMany(l => l.CategoriasHabilitadas)
                .WithOne(x => x.LicenciaPersona)
                .HasForeignKey(x => x.LicenciaPersonaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<LicenciaCategoriaHabilitada>()
                .HasOne(x => x.Categoria)
                .WithMany()
                .HasForeignKey(x => x.CategoriaId)
                .OnDelete(DeleteBehavior.Restrict);

            // Seed Temporada/Modalidad por defecto
            modelBuilder.Entity<Temporada>().HasData(new Temporada
            {
                Id = SeedIds.TemporadaDefaultId,
                Nombre = "Temporada actual",
                // HasData requiere valores constantes (sin DateTime.UtcNow)
                FechaInicio = new DateTime(2025, 8, 1),
                FechaFin = new DateTime(2026, 7, 31),
                Activa = true
            });

            modelBuilder.Entity<Modalidad>().HasData(new Modalidad
            {
                Id = SeedIds.ModalidadDefaultId,
                Nombre = "Voleibol",
                Activa = true
            });

            // Seed Federación Asturiana y Competiciones
            modelBuilder.Entity<Federacion>().HasData(new Federacion
            {
                Id = federacionAsturianaId,
                Nombre = "Federación Asturiana"
            });

            modelBuilder.Entity<Competicion>().HasData(
                new Competicion { Id = Guid.Parse("012f80f7-3b7d-4df2-8a07-35e80c0ba0b0"), FederacionId = federacionAsturianaId, Nombre = "CAMPEONATO DE ASTURIAS BENJAMIN FEMENINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("b5e0c3c9-0d3b-4a4d-8d66-0ad8f91b2f6e"), FederacionId = federacionAsturianaId, Nombre = "JUEGOS DEPORTIVOS BENJAMIN MIXTO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("624f3f92-cf13-4fa7-bc4b-53c9fd2e6b6b"), FederacionId = federacionAsturianaId, Nombre = "CAMPEONATO DE ASTURIAS ALEVIN MASCULINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("9714711c-b47a-4aa7-b923-7b9c0b90d385"), FederacionId = federacionAsturianaId, Nombre = "CAMPEONATO DE ASTURIAS ALEVIN FEMENINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("5c6e5ea5-7af8-437f-a9f2-1f6b16c08a2c"), FederacionId = federacionAsturianaId, Nombre = "JUEGOS DEPORTIVOS ALEVIN MIXTO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("6e53d4b1-f35c-4d68-b8a0-468b06605c64"), FederacionId = federacionAsturianaId, Nombre = "JUEGOS DEPORTIVOS INFANTIL MASCULINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("4ce48b7a-7c1a-4a84-8b30-e150d37ca006"), FederacionId = federacionAsturianaId, Nombre = "JUEGOS DEPORTIVOS 1ª DIVISIÓN INFANTIL FEMENINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("a1c760f2-a6f8-451b-8614-8ed95d40182b"), FederacionId = federacionAsturianaId, Nombre = "JUEGOS DEPORTIVOS 2ª DIVISIÓN INFANTIL MIXTO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("d2bf94da-08a1-4fdc-8d7b-945e52a23b58"), FederacionId = federacionAsturianaId, Nombre = "JUEGOS DEPORTIVOS CADETE MASCULINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("80a146e0-7c3f-4e5c-8ca3-2d9bb56a1d0c"), FederacionId = federacionAsturianaId, Nombre = "JUEGOS DEPORTIVOS 1ª DIVISIÓN CADETE FEMENINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("376842d8-2f21-4f79-a0e2-e4b809c8a02a"), FederacionId = federacionAsturianaId, Nombre = "JUEGOS DEPORTIVOS 2ª DIVISIÓN CADETE FEMENINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("2a2602f8-5f1a-4e02-8ef6-4a1ce41c4b4f"), FederacionId = federacionAsturianaId, Nombre = "CAMPEONATO DE ASTURIAS JUVENIL MASCULINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("c3e8c8e2-3cfe-4b1c-8a7f-9b6b567a7f9a"), FederacionId = federacionAsturianaId, Nombre = "CAMPEONATO DE ASTURIAS JUVENIL FEMENINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("c0db6dd5-5709-41e0-b8d3-f70222b2c1e4"), FederacionId = federacionAsturianaId, Nombre = "CAMPEONATO DE ASTURIAS SEGUNDA DIV. MASCULINA", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("6b47f3a0-0c87-4cf2-8b4e-90c2a0a4db8d"), FederacionId = federacionAsturianaId, Nombre = "PRIMERA DIVISION SENIOR MASCULINA", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("75fa3c5a-3335-468e-94a2-8d7c4f6c57a6"), FederacionId = federacionAsturianaId, Nombre = "SUPERLIGA 2 SENIOR MASCULINA", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("a73b0e31-2f05-4b64-9a8e-448e2a1e8b5f"), FederacionId = federacionAsturianaId, Nombre = "CAMPEONATO DE ASTURIAS SEGUNDA DIV. FEMENINA", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("d3a11a4b-b9c2-4d07-9b4e-67b7f532a6d1"), FederacionId = federacionAsturianaId, Nombre = "PRIMERA DIVISIÓN SENIOR FEMENINA", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("8b4bf1f1-215a-4c27-a7b6-1c6c3a1b6d5d"), FederacionId = federacionAsturianaId, Nombre = "SUPERLIGA 2 SENIOR FEMENINA", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("f8a5e909-4a6a-4a1d-84d9-64283a4ab4e4"), FederacionId = federacionAsturianaId, Nombre = "JUEGOS DEPORTIVOS MINIBENJAMIN MIXTO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("1d0c0e1d-4e64-44f5-9f08-3fe6a6f4e0d9"), FederacionId = federacionAsturianaId, Nombre = "CIRCUITO REGIONAL VOLEY PLAYA SENIOR FEMENINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("c2d56f5b-62ab-4b7f-9b3b-04f06c9f8a87"), FederacionId = federacionAsturianaId, Nombre = "CAMPEONATO DE ASTURIAS JUNIOR MASCULINO", EsFederada = true, Activa = true },
                new Competicion { Id = Guid.Parse("e5f7f38a-6261-4e9d-a0d5-5d90f2e4e5a1"), FederacionId = federacionAsturianaId, Nombre = "CAMPEONATO DE ASTURIAS JUNIOR FEMENINO", EsFederada = true, Activa = true }
            );
        }


    }
}
