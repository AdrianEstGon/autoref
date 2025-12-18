using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations
{
    /// <inheritdoc />
    public partial class PersonasLicenciasTemporadas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Ciudad",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CodigoPostal",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Provincia",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Telefono",
                table: "Personas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Modalidades",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nombre = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Activa = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Modalidades", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Temporadas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nombre = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FechaInicio = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Activa = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Temporadas", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LicenciasPersonas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    PersonaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    TemporadaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ModalidadId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CategoriaBaseId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    NumeroLicencia = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Activa = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    FechaAlta = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Observaciones = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicenciasPersonas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LicenciasPersonas_Categorias_CategoriaBaseId",
                        column: x => x.CategoriaBaseId,
                        principalTable: "Categorias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_LicenciasPersonas_Modalidades_ModalidadId",
                        column: x => x.ModalidadId,
                        principalTable: "Modalidades",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LicenciasPersonas_Personas_PersonaId",
                        column: x => x.PersonaId,
                        principalTable: "Personas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LicenciasPersonas_Temporadas_TemporadaId",
                        column: x => x.TemporadaId,
                        principalTable: "Temporadas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "LicenciasCategoriasHabilitadas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    LicenciaPersonaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CategoriaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    FechaAlta = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LicenciasCategoriasHabilitadas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LicenciasCategoriasHabilitadas_Categorias_CategoriaId",
                        column: x => x.CategoriaId,
                        principalTable: "Categorias",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LicenciasCategoriasHabilitadas_LicenciasPersonas_LicenciaPer~",
                        column: x => x.LicenciaPersonaId,
                        principalTable: "LicenciasPersonas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Modalidades",
                columns: new[] { "Id", "Activa", "Nombre" },
                values: new object[] { new Guid("7a6a2a2f-6136-4c38-9b25-3a6a2a7e4e1b"), true, "Voleibol" });

            migrationBuilder.InsertData(
                table: "Temporadas",
                columns: new[] { "Id", "Activa", "FechaFin", "FechaInicio", "Nombre" },
                values: new object[] { new Guid("b1a7f4c6-41f2-4d3d-9ab5-5a8e3fd5c2d1"), true, new DateTime(2026, 7, 31, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2025, 8, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Temporada actual" });

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasCategoriasHabilitadas_CategoriaId",
                table: "LicenciasCategoriasHabilitadas",
                column: "CategoriaId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasCategoriasHabilitadas_LicenciaPersonaId_CategoriaId",
                table: "LicenciasCategoriasHabilitadas",
                columns: new[] { "LicenciaPersonaId", "CategoriaId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasPersonas_CategoriaBaseId",
                table: "LicenciasPersonas",
                column: "CategoriaBaseId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasPersonas_ModalidadId",
                table: "LicenciasPersonas",
                column: "ModalidadId");

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasPersonas_PersonaId_TemporadaId_ModalidadId",
                table: "LicenciasPersonas",
                columns: new[] { "PersonaId", "TemporadaId", "ModalidadId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LicenciasPersonas_TemporadaId",
                table: "LicenciasPersonas",
                column: "TemporadaId");

            migrationBuilder.CreateIndex(
                name: "IX_Modalidades_Nombre",
                table: "Modalidades",
                column: "Nombre",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Temporadas_Nombre",
                table: "Temporadas",
                column: "Nombre",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LicenciasCategoriasHabilitadas");

            migrationBuilder.DropTable(
                name: "LicenciasPersonas");

            migrationBuilder.DropTable(
                name: "Modalidades");

            migrationBuilder.DropTable(
                name: "Temporadas");

            migrationBuilder.DropColumn(
                name: "Ciudad",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "CodigoPostal",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Provincia",
                table: "Personas");

            migrationBuilder.DropColumn(
                name: "Telefono",
                table: "Personas");
        }
    }
}
