using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations
{
    /// <inheritdoc />
    public partial class MutuaBase : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Competiciones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nombre = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EsFederada = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Activa = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Competiciones", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EnviosMutua",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    FechaEnvioMutua = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    GeneradoPorUsuarioId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnviosMutua", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnviosMutua_Usuarios_GeneradoPorUsuarioId",
                        column: x => x.GeneradoPorUsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Personas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nombre = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Apellidos = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Documento = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FechaNacimiento = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Tipo = table.Column<int>(type: "int", nullable: false),
                    MutuaEnviada = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FechaEnvioMutua = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UltimoEnvioMutuaId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Personas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Personas_EnviosMutua_UltimoEnvioMutuaId",
                        column: x => x.UltimoEnvioMutuaId,
                        principalTable: "EnviosMutua",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Inscripciones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PersonaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    EquipoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CompeticionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    MutuaSolicitada = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FechaSolicitud = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    FechaInscripcion = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Activa = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Inscripciones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Inscripciones_Competiciones_CompeticionId",
                        column: x => x.CompeticionId,
                        principalTable: "Competiciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Inscripciones_Equipos_EquipoId",
                        column: x => x.EquipoId,
                        principalTable: "Equipos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Inscripciones_Personas_PersonaId",
                        column: x => x.PersonaId,
                        principalTable: "Personas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EnviosMutuaItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    EnvioMutuaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    InscripcionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnviosMutuaItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnviosMutuaItems_EnviosMutua_EnvioMutuaId",
                        column: x => x.EnvioMutuaId,
                        principalTable: "EnviosMutua",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EnviosMutuaItems_Inscripciones_InscripcionId",
                        column: x => x.InscripcionId,
                        principalTable: "Inscripciones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_EnviosMutua_GeneradoPorUsuarioId",
                table: "EnviosMutua",
                column: "GeneradoPorUsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_EnviosMutuaItems_EnvioMutuaId",
                table: "EnviosMutuaItems",
                column: "EnvioMutuaId");

            migrationBuilder.CreateIndex(
                name: "IX_EnviosMutuaItems_InscripcionId",
                table: "EnviosMutuaItems",
                column: "InscripcionId");

            migrationBuilder.CreateIndex(
                name: "IX_Inscripciones_CompeticionId",
                table: "Inscripciones",
                column: "CompeticionId");

            migrationBuilder.CreateIndex(
                name: "IX_Inscripciones_EquipoId",
                table: "Inscripciones",
                column: "EquipoId");

            migrationBuilder.CreateIndex(
                name: "IX_Inscripciones_PersonaId_EquipoId_CompeticionId",
                table: "Inscripciones",
                columns: new[] { "PersonaId", "EquipoId", "CompeticionId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Personas_Documento",
                table: "Personas",
                column: "Documento",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Personas_UltimoEnvioMutuaId",
                table: "Personas",
                column: "UltimoEnvioMutuaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EnviosMutuaItems");

            migrationBuilder.DropTable(
                name: "Inscripciones");

            migrationBuilder.DropTable(
                name: "Competiciones");

            migrationBuilder.DropTable(
                name: "Personas");

            migrationBuilder.DropTable(
                name: "EnviosMutua");
        }
    }
}
