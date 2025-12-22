using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations
{
    /// <inheritdoc />
    public partial class AddRequisitosFuncionales_v1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Polideportivos_ImportId",
                table: "Polideportivos");

            migrationBuilder.DropIndex(
                name: "IX_Personas_ImportId",
                table: "Personas");

            migrationBuilder.DropIndex(
                name: "IX_Partidos_ImportId",
                table: "Partidos");

            migrationBuilder.DropIndex(
                name: "IX_Pagos_ImportId",
                table: "Pagos");

            migrationBuilder.DropIndex(
                name: "IX_LicenciasPersonas_ImportId",
                table: "LicenciasPersonas");

            migrationBuilder.DropIndex(
                name: "IX_Jugadores_ImportId",
                table: "Jugadores");

            migrationBuilder.DropIndex(
                name: "IX_GruposEdicion_ImportId",
                table: "GruposEdicion");

            migrationBuilder.DropIndex(
                name: "IX_FechasEntrenamiento_ImportId",
                table: "FechasEntrenamiento");

            migrationBuilder.DropIndex(
                name: "IX_FasesTorneo_ImportId",
                table: "FasesTorneo");

            migrationBuilder.DropIndex(
                name: "IX_Equipos_ImportId",
                table: "Equipos");

            migrationBuilder.DropIndex(
                name: "IX_Designaciones_ImportId",
                table: "Designaciones");

            migrationBuilder.DropIndex(
                name: "IX_Cursos_ImportId",
                table: "Cursos");

            migrationBuilder.DropIndex(
                name: "IX_Competiciones_ImportId",
                table: "Competiciones");

            migrationBuilder.DropIndex(
                name: "IX_Clubs_ImportId",
                table: "Clubs");

            migrationBuilder.DropIndex(
                name: "IX_Categorias_ImportId",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "FechaDestruccion",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "Categorias");

            migrationBuilder.AddColumn<Guid>(
                name: "ReferenciaId",
                table: "Notificaciones",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "Tipo",
                table: "Notificaciones",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Notificaciones",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "Aceptada",
                table: "Designaciones",
                type: "tinyint(1)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaNotificacionUtc",
                table: "Designaciones",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NotificacionEnviada",
                table: "Designaciones",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "CuotaInscripcionEquipo",
                table: "Competiciones",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CuotaInscripcionJugador",
                table: "Competiciones",
                type: "decimal(65,30)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DiasAntelacionFijarHorario",
                table: "Competiciones",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaFinInscripciones",
                table: "Competiciones",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaInicioInscripciones",
                table: "Competiciones",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "HoraMaxPartidos",
                table: "Competiciones",
                type: "time(6)",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "HoraMinPartidos",
                table: "Competiciones",
                type: "time(6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "InscripcionesAbiertas",
                table: "Competiciones",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Noticias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Titulo = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Resumen = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Contenido = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImagenUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Publicada = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Destacada = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FechaPublicacion = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    FechaCreacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    FechaModificacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    AutorUsuarioId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    FederacionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ImportId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Noticias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Noticias_Federaciones_FederacionId",
                        column: x => x.FederacionId,
                        principalTable: "Federaciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Noticias_Usuarios_AutorUsuarioId",
                        column: x => x.AutorUsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("012f80f7-3b7d-4df2-8a07-35e80c0ba0b0"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("1d0c0e1d-4e64-44f5-9f08-3fe6a6f4e0d9"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("2a2602f8-5f1a-4e02-8ef6-4a1ce41c4b4f"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("376842d8-2f21-4f79-a0e2-e4b809c8a02a"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("4ce48b7a-7c1a-4a84-8b30-e150d37ca006"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("5c6e5ea5-7af8-437f-a9f2-1f6b16c08a2c"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("624f3f92-cf13-4fa7-bc4b-53c9fd2e6b6b"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("6b47f3a0-0c87-4cf2-8b4e-90c2a0a4db8d"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("6e53d4b1-f35c-4d68-b8a0-468b06605c64"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("75fa3c5a-3335-468e-94a2-8d7c4f6c57a6"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("80a146e0-7c3f-4e5c-8ca3-2d9bb56a1d0c"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("8b4bf1f1-215a-4c27-a7b6-1c6c3a1b6d5d"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("9714711c-b47a-4aa7-b923-7b9c0b90d385"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("a1c760f2-a6f8-451b-8614-8ed95d40182b"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("a73b0e31-2f05-4b64-9a8e-448e2a1e8b5f"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("b5e0c3c9-0d3b-4a4d-8d66-0ad8f91b2f6e"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("c0db6dd5-5709-41e0-b8d3-f70222b2c1e4"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("c2d56f5b-62ab-4b7f-9b3b-04f06c9f8a87"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("c3e8c8e2-3cfe-4b1c-8a7f-9b6b567a7f9a"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("d2bf94da-08a1-4fdc-8d7b-945e52a23b58"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("d3a11a4b-b9c2-4d07-9b4e-67b7f532a6d1"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("e5f7f38a-6261-4e9d-a0d5-5d90f2e4e5a1"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.UpdateData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("f8a5e909-4a6a-4a1d-84d9-64283a4ab4e4"),
                columns: new[] { "CuotaInscripcionEquipo", "CuotaInscripcionJugador", "DiasAntelacionFijarHorario", "FechaFinInscripciones", "FechaInicioInscripciones", "HoraMaxPartidos", "HoraMinPartidos", "InscripcionesAbiertas" },
                values: new object[] { null, null, null, null, null, null, null, false });

            migrationBuilder.CreateIndex(
                name: "IX_Noticias_AutorUsuarioId",
                table: "Noticias",
                column: "AutorUsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Noticias_FederacionId",
                table: "Noticias",
                column: "FederacionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Noticias");

            migrationBuilder.DropColumn(
                name: "ReferenciaId",
                table: "Notificaciones");

            migrationBuilder.DropColumn(
                name: "Tipo",
                table: "Notificaciones");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Notificaciones");

            migrationBuilder.DropColumn(
                name: "Aceptada",
                table: "Designaciones");

            migrationBuilder.DropColumn(
                name: "FechaNotificacionUtc",
                table: "Designaciones");

            migrationBuilder.DropColumn(
                name: "NotificacionEnviada",
                table: "Designaciones");

            migrationBuilder.DropColumn(
                name: "CuotaInscripcionEquipo",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "CuotaInscripcionJugador",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "DiasAntelacionFijarHorario",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "FechaFinInscripciones",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "FechaInicioInscripciones",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "HoraMaxPartidos",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "HoraMinPartidos",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "InscripcionesAbiertas",
                table: "Competiciones");

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Categorias",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDestruccion",
                table: "Categorias",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ImportId",
                table: "Categorias",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Polideportivos_ImportId",
                table: "Polideportivos",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Personas_ImportId",
                table: "Personas",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_ImportId",
                table: "Partidos",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Pagos_ImportId",
                table: "Pagos",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasPersonas_ImportId",
                table: "LicenciasPersonas",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Jugadores_ImportId",
                table: "Jugadores",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_GruposEdicion_ImportId",
                table: "GruposEdicion",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_FechasEntrenamiento_ImportId",
                table: "FechasEntrenamiento",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_FasesTorneo_ImportId",
                table: "FasesTorneo",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Equipos_ImportId",
                table: "Equipos",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Designaciones_ImportId",
                table: "Designaciones",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Cursos_ImportId",
                table: "Cursos",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Competiciones_ImportId",
                table: "Competiciones",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_ImportId",
                table: "Clubs",
                column: "ImportId");

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_ImportId",
                table: "Categorias",
                column: "ImportId");
        }
    }
}
