using System;
using AutoRef_API.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations;

[DbContext(typeof(AppDataBase))]
[Migration("20251219020000_LiquidacionesBase")]
public class LiquidacionesBase : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Liquidaciones",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                UsuarioId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                Tipo = table.Column<int>(type: "int", nullable: false),
                PartidoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                Fecha = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                Estado = table.Column<int>(type: "int", nullable: false),
                Observaciones = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                FechaCreacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                FechaEnvioUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                FechaResolucionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                ResueltaPorUsuarioId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                MotivoRechazo = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Liquidaciones", x => x.Id);
                table.ForeignKey(
                    name: "FK_Liquidaciones_Partidos_PartidoId",
                    column: x => x.PartidoId,
                    principalTable: "Partidos",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    name: "FK_Liquidaciones_Usuarios_UsuarioId",
                    column: x => x.UsuarioId,
                    principalTable: "Usuarios",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateTable(
            name: "LiquidacionItems",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                LiquidacionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                Tipo = table.Column<int>(type: "int", nullable: false),
                Descripcion = table.Column<string>(type: "longtext", nullable: false)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Cantidad = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                PrecioUnitario = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                Km = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                Importe = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_LiquidacionItems", x => x.Id);
                table.ForeignKey(
                    name: "FK_LiquidacionItems_Liquidaciones_LiquidacionId",
                    column: x => x.LiquidacionId,
                    principalTable: "Liquidaciones",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex(
            name: "IX_LiquidacionItems_LiquidacionId",
            table: "LiquidacionItems",
            column: "LiquidacionId");

        migrationBuilder.CreateIndex(
            name: "IX_Liquidaciones_Estado",
            table: "Liquidaciones",
            column: "Estado");

        migrationBuilder.CreateIndex(
            name: "IX_Liquidaciones_PartidoId",
            table: "Liquidaciones",
            column: "PartidoId");

        migrationBuilder.CreateIndex(
            name: "IX_Liquidaciones_UsuarioId_Fecha",
            table: "Liquidaciones",
            columns: new[] { "UsuarioId", "Fecha" });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "LiquidacionItems");
        migrationBuilder.DropTable(name: "Liquidaciones");
    }
}


