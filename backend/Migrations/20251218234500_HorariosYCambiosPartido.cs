using System;
using AutoRef_API.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations;

[DbContext(typeof(AppDataBase))]
[Migration("20251218234500_HorariosYCambiosPartido")]
public class HorariosYCambiosPartido : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Ventana de fijación de horario (por competición+categoría)
        migrationBuilder.AddColumn<DateTime>(
            name: "HorarioLocalDesde",
            table: "CompeticionesCategorias",
            type: "datetime(6)",
            nullable: true);

        migrationBuilder.AddColumn<DateTime>(
            name: "HorarioLocalHasta",
            table: "CompeticionesCategorias",
            type: "datetime(6)",
            nullable: true);

        // Solicitudes de cambio de partido
        migrationBuilder.CreateTable(
            name: "PartidosCambiosSolicitudes",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                PartidoId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                ClubSolicitanteId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                ClubReceptorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                FechaOriginal = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                HoraOriginal = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                LugarOriginalId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                FechaPropuesta = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                HoraPropuesta = table.Column<TimeSpan>(type: "time(6)", nullable: false),
                LugarPropuestoId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                Motivo = table.Column<string>(type: "longtext", nullable: true)
                    .Annotation("MySql:CharSet", "utf8mb4"),
                Estado = table.Column<int>(type: "int", nullable: false),
                FechaSolicitudUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                FechaRespuestaClubUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                AceptadoPorClub = table.Column<bool>(type: "tinyint(1)", nullable: true),
                FechaValidacionFederacionUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                AprobadoPorFederacion = table.Column<bool>(type: "tinyint(1)", nullable: true)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_PartidosCambiosSolicitudes", x => x.Id);
                table.ForeignKey(
                    name: "FK_PartidosCambiosSolicitudes_Partidos_PartidoId",
                    column: x => x.PartidoId,
                    principalTable: "Partidos",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_PartidosCambiosSolicitudes_Polideportivos_LugarOriginalId",
                    column: x => x.LugarOriginalId,
                    principalTable: "Polideportivos",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.SetNull);
                table.ForeignKey(
                    name: "FK_PartidosCambiosSolicitudes_Polideportivos_LugarPropuestoId",
                    column: x => x.LugarPropuestoId,
                    principalTable: "Polideportivos",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.SetNull);
            })
            .Annotation("MySql:CharSet", "utf8mb4");

        migrationBuilder.CreateIndex(
            name: "IX_PartidosCambiosSolicitudes_PartidoId",
            table: "PartidosCambiosSolicitudes",
            column: "PartidoId");

        migrationBuilder.CreateIndex(
            name: "IX_PartidosCambiosSolicitudes_Estado",
            table: "PartidosCambiosSolicitudes",
            column: "Estado");

        migrationBuilder.CreateIndex(
            name: "IX_PartidosCambiosSolicitudes_LugarOriginalId",
            table: "PartidosCambiosSolicitudes",
            column: "LugarOriginalId");

        migrationBuilder.CreateIndex(
            name: "IX_PartidosCambiosSolicitudes_LugarPropuestoId",
            table: "PartidosCambiosSolicitudes",
            column: "LugarPropuestoId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "PartidosCambiosSolicitudes");

        migrationBuilder.DropColumn(name: "HorarioLocalDesde", table: "CompeticionesCategorias");
        migrationBuilder.DropColumn(name: "HorarioLocalHasta", table: "CompeticionesCategorias");
    }
}


