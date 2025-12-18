using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AutoRef_API.Migrations
{
    /// <inheritdoc />
    public partial class FederacionAsturianaCompeticiones : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Competiciones",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "FederacionId",
                table: "Competiciones",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"),
                collation: "ascii_general_ci");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Clubs",
                type: "varchar(255)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "FederacionId",
                table: "Clubs",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"),
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "Federaciones",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Nombre = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Federaciones", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Federaciones",
                columns: new[] { "Id", "Nombre" },
                values: new object[] { new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "Federación Asturiana" });

            migrationBuilder.InsertData(
                table: "Competiciones",
                columns: new[] { "Id", "Activa", "EsFederada", "FederacionId", "Nombre" },
                values: new object[,]
                {
                    { new Guid("012f80f7-3b7d-4df2-8a07-35e80c0ba0b0"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "CAMPEONATO DE ASTURIAS BENJAMIN FEMENINO" },
                    { new Guid("1d0c0e1d-4e64-44f5-9f08-3fe6a6f4e0d9"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "CIRCUITO REGIONAL VOLEY PLAYA SENIOR FEMENINO" },
                    { new Guid("2a2602f8-5f1a-4e02-8ef6-4a1ce41c4b4f"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "CAMPEONATO DE ASTURIAS JUVENIL MASCULINO" },
                    { new Guid("376842d8-2f21-4f79-a0e2-e4b809c8a02a"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "JUEGOS DEPORTIVOS 2ª DIVISIÓN CADETE FEMENINO" },
                    { new Guid("4ce48b7a-7c1a-4a84-8b30-e150d37ca006"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "JUEGOS DEPORTIVOS 1ª DIVISIÓN INFANTIL FEMENINO" },
                    { new Guid("5c6e5ea5-7af8-437f-a9f2-1f6b16c08a2c"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "JUEGOS DEPORTIVOS ALEVIN MIXTO" },
                    { new Guid("624f3f92-cf13-4fa7-bc4b-53c9fd2e6b6b"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "CAMPEONATO DE ASTURIAS ALEVIN MASCULINO" },
                    { new Guid("6b47f3a0-0c87-4cf2-8b4e-90c2a0a4db8d"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "PRIMERA DIVISION SENIOR MASCULINA" },
                    { new Guid("6e53d4b1-f35c-4d68-b8a0-468b06605c64"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "JUEGOS DEPORTIVOS INFANTIL MASCULINO" },
                    { new Guid("75fa3c5a-3335-468e-94a2-8d7c4f6c57a6"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "SUPERLIGA 2 SENIOR MASCULINA" },
                    { new Guid("80a146e0-7c3f-4e5c-8ca3-2d9bb56a1d0c"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "JUEGOS DEPORTIVOS 1ª DIVISIÓN CADETE FEMENINO" },
                    { new Guid("8b4bf1f1-215a-4c27-a7b6-1c6c3a1b6d5d"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "SUPERLIGA 2 SENIOR FEMENINA" },
                    { new Guid("9714711c-b47a-4aa7-b923-7b9c0b90d385"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "CAMPEONATO DE ASTURIAS ALEVIN FEMENINO" },
                    { new Guid("a1c760f2-a6f8-451b-8614-8ed95d40182b"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "JUEGOS DEPORTIVOS 2ª DIVISIÓN INFANTIL MIXTO" },
                    { new Guid("a73b0e31-2f05-4b64-9a8e-448e2a1e8b5f"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "CAMPEONATO DE ASTURIAS SEGUNDA DIV. FEMENINA" },
                    { new Guid("b5e0c3c9-0d3b-4a4d-8d66-0ad8f91b2f6e"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "JUEGOS DEPORTIVOS BENJAMIN MIXTO" },
                    { new Guid("c0db6dd5-5709-41e0-b8d3-f70222b2c1e4"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "CAMPEONATO DE ASTURIAS SEGUNDA DIV. MASCULINA" },
                    { new Guid("c2d56f5b-62ab-4b7f-9b3b-04f06c9f8a87"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "CAMPEONATO DE ASTURIAS JUNIOR MASCULINO" },
                    { new Guid("c3e8c8e2-3cfe-4b1c-8a7f-9b6b567a7f9a"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "CAMPEONATO DE ASTURIAS JUVENIL FEMENINO" },
                    { new Guid("d2bf94da-08a1-4fdc-8d7b-945e52a23b58"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "JUEGOS DEPORTIVOS CADETE MASCULINO" },
                    { new Guid("d3a11a4b-b9c2-4d07-9b4e-67b7f532a6d1"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "PRIMERA DIVISIÓN SENIOR FEMENINA" },
                    { new Guid("e5f7f38a-6261-4e9d-a0d5-5d90f2e4e5a1"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "CAMPEONATO DE ASTURIAS JUNIOR FEMENINO" },
                    { new Guid("f8a5e909-4a6a-4a1d-84d9-64283a4ab4e4"), true, true, new Guid("6f5a71bb-7f19-4f2d-8f8c-580eec7a9375"), "JUEGOS DEPORTIVOS MINIBENJAMIN MIXTO" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Competiciones_FederacionId_Nombre",
                table: "Competiciones",
                columns: new[] { "FederacionId", "Nombre" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Clubs_FederacionId_Nombre",
                table: "Clubs",
                columns: new[] { "FederacionId", "Nombre" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Federaciones_Nombre",
                table: "Federaciones",
                column: "Nombre",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Clubs_Federaciones_FederacionId",
                table: "Clubs",
                column: "FederacionId",
                principalTable: "Federaciones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Competiciones_Federaciones_FederacionId",
                table: "Competiciones",
                column: "FederacionId",
                principalTable: "Federaciones",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clubs_Federaciones_FederacionId",
                table: "Clubs");

            migrationBuilder.DropForeignKey(
                name: "FK_Competiciones_Federaciones_FederacionId",
                table: "Competiciones");

            migrationBuilder.DropTable(
                name: "Federaciones");

            migrationBuilder.DropIndex(
                name: "IX_Competiciones_FederacionId_Nombre",
                table: "Competiciones");

            migrationBuilder.DropIndex(
                name: "IX_Clubs_FederacionId_Nombre",
                table: "Clubs");

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("012f80f7-3b7d-4df2-8a07-35e80c0ba0b0"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("1d0c0e1d-4e64-44f5-9f08-3fe6a6f4e0d9"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("2a2602f8-5f1a-4e02-8ef6-4a1ce41c4b4f"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("376842d8-2f21-4f79-a0e2-e4b809c8a02a"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("4ce48b7a-7c1a-4a84-8b30-e150d37ca006"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("5c6e5ea5-7af8-437f-a9f2-1f6b16c08a2c"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("624f3f92-cf13-4fa7-bc4b-53c9fd2e6b6b"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("6b47f3a0-0c87-4cf2-8b4e-90c2a0a4db8d"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("6e53d4b1-f35c-4d68-b8a0-468b06605c64"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("75fa3c5a-3335-468e-94a2-8d7c4f6c57a6"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("80a146e0-7c3f-4e5c-8ca3-2d9bb56a1d0c"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("8b4bf1f1-215a-4c27-a7b6-1c6c3a1b6d5d"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("9714711c-b47a-4aa7-b923-7b9c0b90d385"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("a1c760f2-a6f8-451b-8614-8ed95d40182b"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("a73b0e31-2f05-4b64-9a8e-448e2a1e8b5f"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("b5e0c3c9-0d3b-4a4d-8d66-0ad8f91b2f6e"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("c0db6dd5-5709-41e0-b8d3-f70222b2c1e4"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("c2d56f5b-62ab-4b7f-9b3b-04f06c9f8a87"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("c3e8c8e2-3cfe-4b1c-8a7f-9b6b567a7f9a"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("d2bf94da-08a1-4fdc-8d7b-945e52a23b58"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("d3a11a4b-b9c2-4d07-9b4e-67b7f532a6d1"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("e5f7f38a-6261-4e9d-a0d5-5d90f2e4e5a1"));

            migrationBuilder.DeleteData(
                table: "Competiciones",
                keyColumn: "Id",
                keyValue: new Guid("f8a5e909-4a6a-4a1d-84d9-64283a4ab4e4"));

            migrationBuilder.DropColumn(
                name: "FederacionId",
                table: "Competiciones");

            migrationBuilder.DropColumn(
                name: "FederacionId",
                table: "Clubs");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Competiciones",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "Nombre",
                table: "Clubs",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
