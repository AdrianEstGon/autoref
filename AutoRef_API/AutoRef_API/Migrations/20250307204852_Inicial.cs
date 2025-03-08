using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoRef_API.Migrations
{
    /// <inheritdoc />
    public partial class Inicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Polideportivos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Latitud = table.Column<double>(type: "float", nullable: false),
                    Longitud = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Polideportivos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PrimerApellido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SegundoApellido = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Clave = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ClubVinculado = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Licencia = table.Column<int>(type: "int", nullable: false),
                    Nivel = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Latitud = table.Column<double>(type: "float", nullable: false),
                    Longitud = table.Column<double>(type: "float", nullable: false),
                    FotoPerfil = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Disponibilidades",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Franja1 = table.Column<int>(type: "int", nullable: false),
                    Franja2 = table.Column<int>(type: "int", nullable: false),
                    Franja3 = table.Column<int>(type: "int", nullable: false),
                    Franja4 = table.Column<int>(type: "int", nullable: false),
                    Comentarios = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Disponibilidades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Disponibilidades_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "Partidos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LugarId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Arbitro1Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Arbitro2Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnotadorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Hora = table.Column<TimeSpan>(type: "time", nullable: false),
                    EquipoLocal = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EquipoVisitante = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Categoria = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Competicion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LugarId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Arbitro1Id1 = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Arbitro2Id1 = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AnotadorId1 = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Partidos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Partidos_Polideportivos_LugarId",
                        column: x => x.LugarId,
                        principalTable: "Polideportivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_Partidos_Usuarios_AnotadorId",
                        column: x => x.AnotadorId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_Partidos_Usuarios_Arbitro1Id",
                        column: x => x.Arbitro1Id,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_Partidos_Usuarios_Arbitro2Id",
                        column: x => x.Arbitro2Id,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Disponibilidades_UsuarioId",
                table: "Disponibilidades",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_AnotadorId",
                table: "Partidos",
                column: "AnotadorId");


            migrationBuilder.CreateIndex(
                name: "IX_Partidos_Arbitro1Id",
                table: "Partidos",
                column: "Arbitro1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_Arbitro2Id",
                table: "Partidos",
                column: "Arbitro2Id");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_LugarId",
                table: "Partidos",
                column: "LugarId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Disponibilidades");

            migrationBuilder.DropTable(
                name: "Partidos");

            migrationBuilder.DropTable(
                name: "Polideportivos");

            migrationBuilder.DropTable(
                name: "Usuarios");
        }
    }
}
