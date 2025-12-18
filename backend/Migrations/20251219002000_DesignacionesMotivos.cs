using System;
using AutoRef_API.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations;

[DbContext(typeof(AppDataBase))]
[Migration("20251219002000_DesignacionesMotivos")]
public class DesignacionesMotivos : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "MotivoEstadoArbitro1",
            table: "Partidos",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "MotivoEstadoArbitro2",
            table: "Partidos",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "MotivoEstadoAnotador",
            table: "Partidos",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<DateTime>(
            name: "FechaRespuestaArbitro1Utc",
            table: "Partidos",
            type: "datetime(6)",
            nullable: true);

        migrationBuilder.AddColumn<DateTime>(
            name: "FechaRespuestaArbitro2Utc",
            table: "Partidos",
            type: "datetime(6)",
            nullable: true);

        migrationBuilder.AddColumn<DateTime>(
            name: "FechaRespuestaAnotadorUtc",
            table: "Partidos",
            type: "datetime(6)",
            nullable: true);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(name: "MotivoEstadoArbitro1", table: "Partidos");
        migrationBuilder.DropColumn(name: "MotivoEstadoArbitro2", table: "Partidos");
        migrationBuilder.DropColumn(name: "MotivoEstadoAnotador", table: "Partidos");

        migrationBuilder.DropColumn(name: "FechaRespuestaArbitro1Utc", table: "Partidos");
        migrationBuilder.DropColumn(name: "FechaRespuestaArbitro2Utc", table: "Partidos");
        migrationBuilder.DropColumn(name: "FechaRespuestaAnotadorUtc", table: "Partidos");
    }
}


