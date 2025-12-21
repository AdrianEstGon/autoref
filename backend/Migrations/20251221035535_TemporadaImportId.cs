using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations
{
    /// <inheritdoc />
    public partial class TemporadaImportId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Temporadas",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaDestruccion",
                table: "Temporadas",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ImportId",
                table: "Temporadas",
                type: "bigint",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Temporadas",
                keyColumn: "Id",
                keyValue: new Guid("b1a7f4c6-41f2-4d3d-9ab5-5a8e3fd5c2d1"),
                columns: new[] { "FechaCreacion", "FechaDestruccion", "ImportId" },
                values: new object[] { null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Temporadas");

            migrationBuilder.DropColumn(
                name: "FechaDestruccion",
                table: "Temporadas");

            migrationBuilder.DropColumn(
                name: "ImportId",
                table: "Temporadas");
        }
    }
}
