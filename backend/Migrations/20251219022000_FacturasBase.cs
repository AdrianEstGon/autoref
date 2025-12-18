using System;
using AutoRef_API.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations;

[DbContext(typeof(AppDataBase))]
[Migration("20251219022000_FacturasBase")]
public class FacturasBase : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Facturas",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                ClubId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                Numero = table.Column<string>(type: "varchar(64)", nullable: false)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                FechaEmision = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                FechaVencimiento = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                Estado = table.Column<int>(type: "int", nullable: false),
                BaseImponible = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                Iva = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                Total = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                Observaciones = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                FechaCreacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                FechaPagoUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                ReferenciaPago = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Facturas", x => x.Id);
                table.ForeignKey(
                    name: "FK_Facturas_Clubs_ClubId",
                    column: x => x.ClubId,
                    principalTable: "Clubs",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateTable(
            name: "FacturaLineas",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                FacturaId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                Concepto = table.Column<string>(type: "longtext", nullable: false)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Cantidad = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                PrecioUnitario = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                Importe = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                IvaPorcentaje = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_FacturaLineas", x => x.Id);
                table.ForeignKey(
                    name: "FK_FacturaLineas_Facturas_FacturaId",
                    column: x => x.FacturaId,
                    principalTable: "Facturas",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex(
            name: "IX_FacturaLineas_FacturaId",
            table: "FacturaLineas",
            column: "FacturaId");

        migrationBuilder.CreateIndex(
            name: "IX_Facturas_ClubId",
            table: "Facturas",
            column: "ClubId");

        migrationBuilder.CreateIndex(
            name: "IX_Facturas_Estado",
            table: "Facturas",
            column: "Estado");

        migrationBuilder.CreateIndex(
            name: "IX_Facturas_Numero",
            table: "Facturas",
            column: "Numero",
            unique: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "FacturaLineas");
        migrationBuilder.DropTable(name: "Facturas");
    }
}


