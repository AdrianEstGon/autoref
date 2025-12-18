using System;
using AutoRef_API.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations;

[DbContext(typeof(AppDataBase))]
[Migration("20251219013000_LicenciasWorkflow")]
public class LicenciasWorkflow : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<int>(
            name: "Estado",
            table: "LicenciasPersonas",
            type: "int",
            nullable: false,
            defaultValue: 1); // Validada por defecto (compatibilidad con licencias existentes)

        migrationBuilder.AddColumn<DateTime>(
            name: "FechaSolicitudUtc",
            table: "LicenciasPersonas",
            type: "datetime(6)",
            nullable: true);

        migrationBuilder.AddColumn<Guid>(
            name: "ClubSolicitanteId",
            table: "LicenciasPersonas",
            type: "char(36)",
            nullable: true,
            collation: "ascii_general_ci");

        migrationBuilder.AddColumn<DateTime>(
            name: "FechaValidacionUtc",
            table: "LicenciasPersonas",
            type: "datetime(6)",
            nullable: true);

        migrationBuilder.AddColumn<Guid>(
            name: "ValidadaPorUsuarioId",
            table: "LicenciasPersonas",
            type: "char(36)",
            nullable: true,
            collation: "ascii_general_ci");

        migrationBuilder.AddColumn<string>(
            name: "MotivoRechazo",
            table: "LicenciasPersonas",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "Estado", table: "LicenciasPersonas");
        migrationBuilder.DropColumn(name: "FechaSolicitudUtc", table: "LicenciasPersonas");
        migrationBuilder.DropColumn(name: "ClubSolicitanteId", table: "LicenciasPersonas");
        migrationBuilder.DropColumn(name: "FechaValidacionUtc", table: "LicenciasPersonas");
        migrationBuilder.DropColumn(name: "ValidadaPorUsuarioId", table: "LicenciasPersonas");
        migrationBuilder.DropColumn(name: "MotivoRechazo", table: "LicenciasPersonas");
    }
}


