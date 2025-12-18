using System;
using AutoRef_API.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations;

[DbContext(typeof(AppDataBase))]
[Migration("20251218211500_GestionClubesEquipos")]
public class GestionClubesEquipos : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Clubs: datos fiscales + responsables
        migrationBuilder.AddColumn<string>(
            name: "RazonSocial",
            table: "Clubs",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "CIF",
            table: "Clubs",
            type: "varchar(255)",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "DireccionFiscal",
            table: "Clubs",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "CodigoPostalFiscal",
            table: "Clubs",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "ProvinciaFiscal",
            table: "Clubs",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "CiudadFiscal",
            table: "Clubs",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "EmailFacturacion",
            table: "Clubs",
            type: "varchar(255)",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "Telefono",
            table: "Clubs",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "ResponsableNombre",
            table: "Clubs",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "ResponsableEmail",
            table: "Clubs",
            type: "varchar(255)",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.AddColumn<string>(
            name: "ResponsableTelefono",
            table: "Clubs",
            type: "longtext",
            nullable: true)
            .Annotation("MySql:CharSet", "utf8mb4");

        // Categorias: cupos
        migrationBuilder.AddColumn<int>(
            name: "MinJugadores",
            table: "Categorias",
            type: "int",
            nullable: true);

        migrationBuilder.AddColumn<int>(
            name: "MaxJugadores",
            table: "Categorias",
            type: "int",
            nullable: true);

        // Equipos: competición
        migrationBuilder.AddColumn<Guid>(
            name: "CompeticionId",
            table: "Equipos",
            type: "char(36)",
            nullable: true,
            collation: "ascii_general_ci");

        // MySQL: el campo Nombre de Equipos debe ser VARCHAR para poder indexarlo (no TEXT/LONGTEXT)
        migrationBuilder.AlterColumn<string>(
            name: "Nombre",
            table: "Equipos",
            type: "varchar(255)",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "longtext")
            .Annotation("MySql:CharSet", "utf8mb4")
            .OldAnnotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex(
            name: "IX_Clubs_FederacionId_CIF",
            table: "Clubs",
            columns: new[] { "FederacionId", "CIF" },
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_Equipos_ClubId_CompeticionId_CategoriaId_Nombre",
            table: "Equipos",
            columns: new[] { "ClubId", "CompeticionId", "CategoriaId", "Nombre" },
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_Equipos_CompeticionId",
            table: "Equipos",
            column: "CompeticionId");

        migrationBuilder.AddForeignKey(
            name: "FK_Equipos_Competiciones_CompeticionId",
            table: "Equipos",
            column: "CompeticionId",
            principalTable: "Competiciones",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Equipos_Competiciones_CompeticionId",
            table: "Equipos");

        migrationBuilder.DropIndex(
            name: "IX_Clubs_FederacionId_CIF",
            table: "Clubs");

        migrationBuilder.DropIndex(
            name: "IX_Equipos_ClubId_CompeticionId_CategoriaId_Nombre",
            table: "Equipos");

        migrationBuilder.DropIndex(
            name: "IX_Equipos_CompeticionId",
            table: "Equipos");

        migrationBuilder.AlterColumn<string>(
            name: "Nombre",
            table: "Equipos",
            type: "longtext",
            nullable: false,
            oldClrType: typeof(string),
            oldType: "varchar(255)")
            .Annotation("MySql:CharSet", "utf8mb4")
            .OldAnnotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.DropColumn(
            name: "RazonSocial",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "CIF",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "DireccionFiscal",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "CodigoPostalFiscal",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "ProvinciaFiscal",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "CiudadFiscal",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "EmailFacturacion",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "Telefono",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "ResponsableNombre",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "ResponsableEmail",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "ResponsableTelefono",
            table: "Clubs");

        migrationBuilder.DropColumn(
            name: "MinJugadores",
            table: "Categorias");

        migrationBuilder.DropColumn(
            name: "MaxJugadores",
            table: "Categorias");

        migrationBuilder.DropColumn(
            name: "CompeticionId",
            table: "Equipos");
    }
}


