using System;
using AutoRef_API.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations;

[DbContext(typeof(AppDataBase))]
[Migration("20251219010000_ActaResultadosPublico")]
public class ActaResultadosPublico : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<bool>(
            name: "Cerrado",
            table: "Partidos",
            type: "tinyint(1)",
            nullable: false,
            defaultValue: false);

        migrationBuilder.AddColumn<DateTime>(
            name: "FechaCierreUtc",
            table: "Partidos",
            type: "datetime(6)",
            nullable: true);

        migrationBuilder.AddColumn<int>(
            name: "ResultadoLocal",
            table: "Partidos",
            type: "int",
            nullable: true);

        migrationBuilder.AddColumn<int>(
            name: "ResultadoVisitante",
            table: "Partidos",
            type: "int",
            nullable: true);

        migrationBuilder.CreateTable(
            name: "ActasPartido",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                PartidoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                DataJson = table.Column<string>(type: "longtext", nullable: false)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                CreadaPorUsuarioId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                FechaActualizacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_ActasPartido", x => x.Id);
                table.ForeignKey(
                    name: "FK_ActasPartido_Partidos_PartidoId",
                    column: x => x.PartidoId,
                    principalTable: "Partidos",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex(
            name: "IX_ActasPartido_PartidoId",
            table: "ActasPartido",
            column: "PartidoId",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "ActasPartido");

        migrationBuilder.DropColumn(name: "Cerrado", table: "Partidos");
        migrationBuilder.DropColumn(name: "FechaCierreUtc", table: "Partidos");
        migrationBuilder.DropColumn(name: "ResultadoLocal", table: "Partidos");
        migrationBuilder.DropColumn(name: "ResultadoVisitante", table: "Partidos");
    }
}


