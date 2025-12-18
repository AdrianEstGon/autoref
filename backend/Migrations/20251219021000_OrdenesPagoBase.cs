using System;
using AutoRef_API.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations;

[DbContext(typeof(AppDataBase))]
[Migration("20251219021000_OrdenesPagoBase")]
public class OrdenesPagoBase : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "Iban",
            table: "Usuarios",
            type: "varchar(64)",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "Bic",
            table: "Usuarios",
            type: "varchar(32)",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "TitularCuenta",
            table: "Usuarios",
            type: "varchar(255)",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateTable(
            name: "OrdenesPago",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                Estado = table.Column<int>(type: "int", nullable: false),
                FechaCreacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                ExportadaUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                EjecutadaUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                PeriodoDesde = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                PeriodoHasta = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                GeneradaPorUsuarioId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                Referencia = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_OrdenesPago", x => x.Id);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateTable(
            name: "OrdenesPagoItems",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                OrdenPagoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                LiquidacionId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                UsuarioId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                Importe = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_OrdenesPagoItems", x => x.Id);
                table.ForeignKey(
                    name: "FK_OrdenesPagoItems_Liquidaciones_LiquidacionId",
                    column: x => x.LiquidacionId,
                    principalTable: "Liquidaciones",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
                table.ForeignKey(
                    name: "FK_OrdenesPagoItems_OrdenesPago_OrdenPagoId",
                    column: x => x.OrdenPagoId,
                    principalTable: "OrdenesPago",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_OrdenesPagoItems_Usuarios_UsuarioId",
                    column: x => x.UsuarioId,
                    principalTable: "Usuarios",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex(
            name: "IX_OrdenesPago_Estado",
            table: "OrdenesPago",
            column: "Estado");

        migrationBuilder.CreateIndex(
            name: "IX_OrdenesPagoItems_LiquidacionId",
            table: "OrdenesPagoItems",
            column: "LiquidacionId");

        migrationBuilder.CreateIndex(
            name: "IX_OrdenesPagoItems_OrdenPagoId",
            table: "OrdenesPagoItems",
            column: "OrdenPagoId");

        migrationBuilder.CreateIndex(
            name: "IX_OrdenesPagoItems_UsuarioId",
            table: "OrdenesPagoItems",
            column: "UsuarioId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "OrdenesPagoItems");
        migrationBuilder.DropTable(name: "OrdenesPago");

        migrationBuilder.DropColumn(name: "Iban", table: "Usuarios");
        migrationBuilder.DropColumn(name: "Bic", table: "Usuarios");
        migrationBuilder.DropColumn(name: "TitularCuenta", table: "Usuarios");
    }
}


