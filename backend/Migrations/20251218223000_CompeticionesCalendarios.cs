using System;
using AutoRef_API.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations;

[DbContext(typeof(AppDataBase))]
[Migration("20251218223000_CompeticionesCalendarios")]
public class CompeticionesCalendarios : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Competiciones: temporada/modalidad
        migrationBuilder.AddColumn<Guid>(
            name: "TemporadaId",
            table: "Competiciones",
            type: "char(36)",
            nullable: true,
            collation: "ascii_general_ci");

        migrationBuilder.AddColumn<Guid>(
            name: "ModalidadId",
            table: "Competiciones",
            type: "char(36)",
            nullable: true,
            collation: "ascii_general_ci");

        migrationBuilder.CreateIndex(
            name: "IX_Competiciones_TemporadaId",
            table: "Competiciones",
            column: "TemporadaId");

        migrationBuilder.CreateIndex(
            name: "IX_Competiciones_ModalidadId",
            table: "Competiciones",
            column: "ModalidadId");

        migrationBuilder.AddForeignKey(
            name: "FK_Competiciones_Temporadas_TemporadaId",
            table: "Competiciones",
            column: "TemporadaId",
            principalTable: "Temporadas",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);

        migrationBuilder.AddForeignKey(
            name: "FK_Competiciones_Modalidades_ModalidadId",
            table: "Competiciones",
            column: "ModalidadId",
            principalTable: "Modalidades",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);

        // Config categorías por competición
        migrationBuilder.CreateTable(
            name: "CompeticionesCategorias",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                CompeticionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                CategoriaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                InscripcionDesde = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                InscripcionHasta = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                Cuota = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                Activa = table.Column<bool>(type: "tinyint(1)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_CompeticionesCategorias", x => x.Id);
                table.ForeignKey(
                    name: "FK_CompeticionesCategorias_Competiciones_CompeticionId",
                    column: x => x.CompeticionId,
                    principalTable: "Competiciones",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_CompeticionesCategorias_Categorias_CategoriaId",
                    column: x => x.CategoriaId,
                    principalTable: "Categorias",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex(
            name: "IX_CompeticionesCategorias_CompeticionId_CategoriaId",
            table: "CompeticionesCategorias",
            columns: new[] { "CompeticionId", "CategoriaId" },
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_CompeticionesCategorias_CategoriaId",
            table: "CompeticionesCategorias",
            column: "CategoriaId");

        // Reglas por competición
        migrationBuilder.CreateTable(
            name: "CompeticionesReglas",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                CompeticionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                PuntosVictoria = table.Column<int>(type: "int", nullable: false),
                PuntosEmpate = table.Column<int>(type: "int", nullable: false),
                PuntosDerrota = table.Column<int>(type: "int", nullable: false),
                OrdenDesempateJson = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                UpdatedAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_CompeticionesReglas", x => x.Id);
                table.ForeignKey(
                    name: "FK_CompeticionesReglas_Competiciones_CompeticionId",
                    column: x => x.CompeticionId,
                    principalTable: "Competiciones",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex(
            name: "IX_CompeticionesReglas_CompeticionId",
            table: "CompeticionesReglas",
            column: "CompeticionId",
            unique: true);

        // Partidos: CompeticionId
        migrationBuilder.AddColumn<Guid>(
            name: "CompeticionId",
            table: "Partidos",
            type: "char(36)",
            nullable: true,
            collation: "ascii_general_ci");

        migrationBuilder.CreateIndex(
            name: "IX_Partidos_CompeticionId",
            table: "Partidos",
            column: "CompeticionId");

        migrationBuilder.AddForeignKey(
            name: "FK_Partidos_Competiciones_CompeticionId",
            table: "Partidos",
            column: "CompeticionId",
            principalTable: "Competiciones",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Competiciones_Modalidades_ModalidadId",
            table: "Competiciones");

        migrationBuilder.DropForeignKey(
            name: "FK_Competiciones_Temporadas_TemporadaId",
            table: "Competiciones");

        migrationBuilder.DropForeignKey(
            name: "FK_Partidos_Competiciones_CompeticionId",
            table: "Partidos");

        migrationBuilder.DropTable(name: "CompeticionesCategorias");
        migrationBuilder.DropTable(name: "CompeticionesReglas");

        migrationBuilder.DropIndex(name: "IX_Competiciones_ModalidadId", table: "Competiciones");
        migrationBuilder.DropIndex(name: "IX_Competiciones_TemporadaId", table: "Competiciones");

        migrationBuilder.DropColumn(name: "ModalidadId", table: "Competiciones");
        migrationBuilder.DropColumn(name: "TemporadaId", table: "Competiciones");

        migrationBuilder.DropIndex(name: "IX_Partidos_CompeticionId", table: "Partidos");
        migrationBuilder.DropColumn(name: "CompeticionId", table: "Partidos");
    }
}


